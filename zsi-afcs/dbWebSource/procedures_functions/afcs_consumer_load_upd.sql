

CREATE PROCEDURE [dbo].[afcs_consumer_load_upd]  
(  
   @hash_key NVARCHAR(50)
   , @email NVARCHAR(300)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @consumer_id INT;
	DECLARE @current_consumer_credit_amount DECIMAL(12, 2);
	DECLARE @is_already_loaded NCHAR(1);
	DECLARE @generated_qr_id INT;
	DECLARE @generated_qr_amount DECIMAL(12, 2);

	SELECT 
		@consumer_id = consumer_id
		, @current_consumer_credit_amount = credit_amount
	FROM dbo.consumers WHERE 1 = 1
	AND email = @email;

	SELECT 
		@generated_qr_id = id
		, @is_already_loaded = is_loaded
		, @generated_qr_amount = balance_amt
	FROM dbo.generated_qrs WHERE 1 = 1
	AND hash_key = @hash_key;

	IF ISNULL(@is_already_loaded, '') = 'Y'
	BEGIN
		SELECT
			'N' AS is_loaded
			, 'N' AS is_valid
			, 'QR Code is not valid.' AS load_msg
			, 0.00 AS amount_loaded
			, @current_consumer_credit_amount AS consumer_credit_amount
	END
	ELSE
	BEGIN
		BEGIN TRAN;

		DECLARE @new_consumer_amount DECIMAL(12, 2) = 0;
		SET @new_consumer_amount = ISNULL(@current_consumer_credit_amount, 0) + ISNULL(@generated_qr_amount, 0);
		UPDATE 
			dbo.consumers 
		SET 
			credit_amount = @new_consumer_amount 
		WHERE 1 = 1 
		AND consumer_id = @consumer_id;

		UPDATE
			dbo.generated_qrs
		SET
			is_loaded = 'Y'
			, is_taken = 'Y'
			, consumer_id = @consumer_id
			, updated_by = @consumer_id
			, updated_date = GETDATE()
		WHERE 1 = 1
		AND id = @generated_qr_id;

		IF @@ERROR = 0
		BEGIN
			COMMIT;
		END
		ELSE
		BEGIN
			ROLLBACK;
		END

		IF @@ERROR = 0
			SELECT
				'Y' AS is_loaded
				, 'Y' AS is_valid
				, 'QR Code loaded successfully.' AS load_msg
				, @generated_qr_amount AS amount_loaded
				, @new_consumer_amount AS consumer_credit_amount
	END
END;