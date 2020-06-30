
CREATE PROCEDURE [dbo].[afcs_2_qr_payment_upd]  
(  
     @hash_key1 NVARCHAR(MAX)
   , @hash_key2 NVARCHAR(MAX)
   , @base_fare DECIMAL(12, 2)
   , @regular_count INT
   , @student_count INT
   , @senior_count INT
   , @pwd_count INT
   , @regular_amount DECIMAL(12, 2)
   , @student_amount DECIMAL(12, 2)
   , @senior_amount DECIMAL(12, 2)
   , @pwd_amount DECIMAL(12, 2)
   , @vehicle_hash_key NVARCHAR(MAX)
   , @driver_hash_key NVARCHAR(MAX)
   , @trip_no INT
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	DECLARE @id INT;
	DECLARE @error INT = 0;
	DECLARE @generated_qrs_id INT;
	DECLARE @consumer_id INT;
	DECLARE @new_credit_amount DECIMAL(12, 2);
	DECLARE @credit_amount DECIMAL(12, 2);
	DECLARE @total_amount DECIMAL(12, 2);
	DECLARE @mobile_no NVARCHAR(20);
	DECLARE @vehicle_id INT;
	DECLARE @driver_id INT;
	DECLARE @client_id INT;
	-- Check whether the hash_key1 and hash_key2 exists in the generated_qrs table and is active.
	SELECT 
		@generated_qrs_id = [id] 
	FROM dbo.generated_qrs 
	WHERE 1 = 1 
	AND is_active = 'Y' 
	AND hash_key = @hash_key1
	AND hash_key2 = @hash_key2;

	IF @generated_qrs_id IS NOT NULL
	BEGIN
		SELECT
			@consumer_id = a.[consumer_id]
			, @credit_amount = a.[balance_amt] 
			, @mobile_no = b.[mobile_no]
		FROM dbo.generated_qrs a
		JOIN dbo.consumers b
		ON a.consumer_id = b.consumer_id
		WHERE 1 = 1
		AND a.hash_key = @hash_key1
		AND a.hash_key2 = @hash_key2;

		IF @consumer_id IS NOT NULL
		BEGIN
			SET @total_amount = ISNULL(@regular_amount, 0) + ISNULL(@student_amount, 0) + ISNULL(@senior_amount, 0) + ISNULL(@pwd_amount, 0);
			
			IF @credit_amount >= @total_amount
			BEGIN
				SELECT
					@vehicle_id = vehicle_id
					,@client_id  = company_id
				FROM dbo.active_vehicles_v WHERE 1 = 1
				AND hash_key = @vehicle_hash_key;

				SELECT
					@driver_id = [user_id]
				FROM dbo.drivers_v WHERE 1 = 1
				AND hash_key = @driver_hash_key;

				BEGIN TRAN;

				SET @new_credit_amount = @credit_amount - @total_amount;

				UPDATE 
					dbo.generated_qrs 
				SET
					[balance_amt] = @new_credit_amount
					, [updated_by] = @consumer_id
					, [updated_date] = GETDATE()
				WHERE 1 = 1
				AND id = @generated_qrs_id;

				-- Insert record in the payments table.
				INSERT INTO [dbo].[payments](
					[payment_date]
					, [no_reg]
					, [no_stu]
					, [no_sc]
					, [no_pwd]
					, [reg_amount]
					, [stu_amount]
					, [sc_amount]
					, [pwd_amount]
					, [consumer_id]
					, [vehicle_id]
					, [driver_id]
					, [trip_no]
					, [qr_id]
					, [base_fare]
					, [client_id]
				)
				VALUES(
					GETDATE()
					, @regular_count
					, @student_count
					, @senior_count
					, @pwd_count
					, @regular_amount
					, @student_amount
					, @senior_amount
					, @pwd_amount
					, @consumer_id
					, @vehicle_id
					, @driver_id
					, @trip_no
					, @generated_qrs_id
					, @base_fare
					, @client_id
				)

				SET @id = @@IDENTITY;
				UPDATE [dbo].[payments] SET qr_ref_no = 'ZP' + cast(rand() * + 1000000 as NVARCHAR(6)) where payment_id=@id;

				-- Insert record in the sms_notifications table.
				INSERT INTO [dbo].[sms_notifications]
				   ([app_name]
				   ,[mobile_no]
				   ,[message]
				   ,[is_processed]
				   ,[created_by]
				   ,[created_date])
				VALUES(
					'zpay'
				   , @mobile_no
				   , 'A payment amount of ' + CAST(@total_amount AS NVARCHAR(100)) + ' was made on ' + CAST(GETDATE() AS NVARCHAR(100)) + ' .'
				   , 'N'
				   , @user_id
				   , GETDATE())

				IF @@ERROR <> 0
				BEGIN
					SET @error = 1;
				END

				IF @error = 0
				BEGIN
					COMMIT;

					SELECT 
						'Y' AS is_valid
						, 'Payment successful.' AS msg
				END
				ELSE
				BEGIN
					ROLLBACK;

					SELECT 
						'N' AS is_valid
						, 'An error occurred while processing the payment.' AS msg
				END
			END
			ELSE
			BEGIN
				SELECT 
					'N' AS is_valid
					, 'User has insufficient balance. Current balance is ' + CAST(@credit_amount AS NVARCHAR(100)) + '.' AS msg
			END
		END
		ELSE
		BEGIN
			SELECT 
				'N' AS is_valid
				, 'User not found.' AS msg
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' AS is_valid
			, 'User not found.' AS msg
	END
END;


