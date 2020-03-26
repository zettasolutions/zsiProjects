

CREATE PROCEDURE [dbo].[afcs_qr_payment_upd]  
(  
   @serial_no NVARCHAR(50)
   , @hash_key NVARCHAR(50)
   , @payment_amount DECIMAL(12, 2)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @device_id INT = 0;
	DECLARE @generated_qr_id INT;
	DECLARE @current_balance_amount DECIMAL(12, 2);

	SELECT @device_id = device_id
		FROM dbo.devices WHERE 1 = 1
		AND serial_no = @serial_no
		AND is_active = 'Y'

	IF @device_id > 0
	BEGIN
		SELECT 
			@generated_qr_id = id
			, @current_balance_amount = balance_amt
		FROM dbo.generated_qrs WHERE 1 = 1
		AND hash_key = @hash_key
		AND is_taken = 'Y'
		AND is_active = 'Y'

		IF @current_balance_amount < @payment_amount
		BEGIN
			SELECT 
				'N' AS is_valid
				, 'Payment unsuccessful. Not enough credits.' AS msg
				, @current_balance_amount AS current_balance_amount
		END
		ELSE
		BEGIN
			IF @generated_qr_id > 0
			BEGIN
				BEGIN TRAN;

				UPDATE 
					dbo.generated_qrs
				SET
					balance_amt = @current_balance_amount - @payment_amount
					, updated_by = @user_id
					, updated_date = GETDATE()
				WHERE 1 = 1
				AND id = @generated_qr_id

				IF @@ERROR = 0
				BEGIN
					COMMIT;
					SELECT 
						'Y' AS is_valid
						, 'Payment successful.' AS msg
						, (@current_balance_amount - @payment_amount) AS current_balance_amount
				END
				ELSE
				BEGIN
					ROLLBACK;
					SELECT 
						'N' AS is_valid
						, 'Error occurred while processing the payment.' AS msg
						, @current_balance_amount AS current_balance_amount
				END
			END
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' AS is_valid
			, 'Device is not registered to process payment.' AS msg
			, 0 AS current_balance_amount
	END
END;