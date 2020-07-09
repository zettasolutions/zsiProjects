

CREATE PROCEDURE [dbo].[zload_load_upd]  
(  
	  @merchant_hash_key	NVARCHAR(MAX)
	, @user_hash_key		NVARCHAR(MAX)
	, @otp					NVARCHAR(MAX)
	, @user_id				INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @consumer_id INT;
	DECLARE @consumer_current_balance_amount DECIMAL(12, 2);
	DECLARE @consumer_new_balance_amount DECIMAL(12, 2);
	DECLARE @consumer_mobile_no NVARCHAR(12);
	DECLARE @client_id INT;
	DECLARE @client_current_balance_amount DECIMAL(12, 2);
	DECLARE @client_new_balance_amount DECIMAL(12, 2);

	DECLARE @loading_temp_id INT;
	DECLARE @load_date DATETIME;
	DECLARE @load_temp_qr_id INT;
	DECLARE @load_amount DECIMAL(12, 2);
	DECLARE @load_by INT;
	DECLARE @loading_branch_id INT;

	SELECT 
		@loading_temp_id = loading_temp_id 
		, @load_date = load_date
		, @load_temp_qr_id = qr_id
		, @load_amount = load_amount
		, @load_by = load_by
		, @loading_branch_id = loading_branch_id
	FROM dbo.loading_temp 
	WHERE 1 = 1
	AND is_processed = 'N'
	AND otp = @otp
	AND otp_expiry_date >= GETDATE();


	IF @loading_temp_id IS NOT NULL
	BEGIN
		SELECT 
			  @consumer_id = consumer_id 
			, @consumer_current_balance_amount = ISNULL(balance_amt, 0)
		FROM dbo.generated_qrs 
		WHERE is_active = 'Y'
		 AND  id = @load_temp_qr_id;

		IF @consumer_id IS NOT NULL
		   SELECT  @consumer_mobile_no = mobile_no FROM dbo.consumers WHERE is_active='Y'

		BEGIN
			SELECT 
				 @client_id = client_id 
				,@client_current_balance_amount = ISNULL(balance_amount, 0)
			FROM dbo.load_merchants_v
			WHERE is_active = 'Y'
			AND hash_key = @merchant_hash_key;

			IF @client_id IS NOT NULL
			BEGIN
				IF @client_current_balance_amount > @load_amount
				BEGIN
					BEGIN TRAN;

					SET @consumer_new_balance_amount = @consumer_current_balance_amount + @load_amount;
					SET @client_new_balance_amount = @client_current_balance_amount - @load_amount;

					-- Update the main qr of the consumer.
					UPDATE
						dbo.generated_qrs
					SET
						balance_amt = @consumer_new_balance_amount
						, updated_by = @client_id
						, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
					WHERE 1 = 1
					AND id = @load_temp_qr_id;

					-- Update the balance amount of the client.
					UPDATE
						zsi_crm.dbo.clients 
					SET 
						balance_amount = @client_new_balance_amount
						, updated_by = @client_id
						, updated_date = DATEADD(HOUR, 8, GETUTCDATE())
					WHERE 1 = 1
					AND client_id = @client_id;

					-- Insert new record in the loading table.
					INSERT INTO dbo.loading (
						load_date
						, qr_id
						, load_amount
						, load_by
						, is_top_up
						, loading_branch_id
						, ref_no
					) VALUES (
						@load_date
						, @load_temp_qr_id
						, @load_amount
						, @load_by
						, 'N'
						, @client_id
						, 'ZM' + CAST(RAND() * 1000000 AS VARCHAR(20))
					)
					
					-- Insert new record in the sms_notifications table so that the consumer will be notified through sms.
					IF isnull(@consumer_mobile_no,'')<>''
						INSERT INTO [dbo].[sms_notifications]
							([app_name]
							,[mobile_no]
							,[message]
							,[is_processed]
							,[created_by]
							,[created_date])
						VALUES(
							'zload'
							, @consumer_mobile_no
							, 'You have received an amount of PHP ' + CAST(@load_amount AS NVARCHAR(100)) + ' through zLoad.'
							, 'N'
							, @load_by
							,DATEADD(HOUR, 8, GETUTCDATE()))

					-- Update loading_temp table and set to is_processed = 'Y'
					UPDATE
						dbo.loading_temp
					SET
						is_processed = 'Y'
					WHERE 1 = 1
					AND loading_temp_id = @loading_temp_id;

					IF @@ERROR = 0
					BEGIN
						COMMIT;
						SELECT
							'Y' AS is_valid
							, 'Transaction successful.' AS msg
							, @load_amount AS amount_loaded
							, @client_new_balance_amount AS merchant_balance_amount
					END
					ELSE
					BEGIN
						ROLLBACK;
						SELECT
							'N' AS is_valid
							, 'An error occurred while processing the transaction.' AS msg
							, @load_amount AS amount_loaded
							, @client_current_balance_amount AS merchant_balance_amount
					END
				END
				ELSE
				BEGIN
					SELECT
						'N' AS is_valid
						, 'Merchant balance is insufficient.' AS msg
						, @load_amount AS amount_loaded
						, @client_current_balance_amount AS merchant_balance_amount
				END
			END
			ELSE
			BEGIN
				SELECT
					'N' AS is_valid
					, 'Merchant account not found.' AS msg
					, @load_amount AS amount_loaded
					, 0 AS merchant_balance_amount
			END
		END
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'OTP is no longer valid.' AS msg
			, 0 AS amount_loaded
			, 0 AS merchant_balance_amount
	END
END;