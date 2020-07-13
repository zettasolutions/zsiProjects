

CREATE PROCEDURE [dbo].[afcs_activate_upd]  
(  
     @username NVARCHAR(100)
   , @activation_code NVARCHAR(6)
   , @hash_key NVARCHAR(MAX) = ''
   , @hash_key2 NVARCHAR(MAX) = ''
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @consumer_id INT;
	DECLARE @generated_qr_id INT;

	SELECT 
		@consumer_id = consumer_id
	FROM dbo.consumers WHERE 1 = 1 
	AND mobile_no = @username
	AND activation_code = @activation_code;

	IF @consumer_id IS NOT NULL
	BEGIN
		-- Get new qr and assign to consumer.
		IF ISNULL(@hash_key, '') = ''
		BEGIN
			SELECT
				@generated_qr_id = id
			FROM dbo.generated_qr_top_not_taken_v;
		END
		ELSE
		-- Assign existing qr to consumer.
		BEGIN
			SELECT
				@generated_qr_id = id
			FROM dbo.generated_qrs_prepaid_v
			WHERE hash_key = @hash_key
			AND hash_key2 = @hash_key2;
		END

		IF @generated_qr_id IS NOT NULL
		BEGIN
			BEGIN TRAN;

			UPDATE dbo.consumers
			SET  qr_id=@generated_qr_id
				,is_active = 'Y'
				,activation_code_expiry=null
				,updated_date = DATEADD(HOUR,8,GETUTCDATE())
			WHERE 1 = 1
			AND consumer_id = @consumer_id;

			UPDATE dbo.generated_qrs
			SET 
				 is_taken  = 'Y'
			    ,consumer_id = @consumer_id
				,expiry_date = DATEADD(MONTH,6,DATEADD(HOUR,8,GETUTCDATE()))
			WHERE 1 = 1
			AND id = @generated_qr_id;

			IF @@ERROR = 0
			BEGIN
				COMMIT;
				SELECT 
					'Y' is_valid
					, 'Activation successful. Welcome to zPay!' AS msg
			END
			ELSE
			BEGIN
				ROLLBACK;
				SELECT 
					'N' is_valid
					, 'An error occurred. Please contact system support.' AS msg
			END
		END
		ELSE
		BEGIN
			SELECT 
				'N' is_valid
				, 'Invalid QR code.' AS msg
		ENd
	END
	ELSE
	BEGIN
		SELECT 
			'N' is_valid
			, 'Invalid activation code. Please try again.' AS msg
	END
END;


