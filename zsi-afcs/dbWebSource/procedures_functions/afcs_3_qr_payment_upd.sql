
CREATE PROCEDURE [dbo].[afcs_3_qr_payment_upd](  
	@serial_no NVARCHAR(50)
	, @hash_key1 NVARCHAR(MAX)
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
	, @driver_id INT
	, @trip_hash_key NVARCHAR(MAX)
	, @pao_id INT
	, @route_id INT
	, @from_location NVARCHAR(100)
	, @to_location NVARCHAR(100)
	, @travel_distance DECIMAL(12, 2)
	, @start_km INT
	, @end_km INT
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
	DECLARE @client_id INT;
	DECLARE @device_id INT = 0;
	DECLARE @new_id NVARCHAR(50);
	DECLARE @trip_id INT;
	DECLARE @or_number NVARCHAR(10);

	SELECT @or_number = '000999'; -- TODO
	SELECT @new_id = NEWID();
	
	SELECT @device_id = device_id
		FROM dbo.devices WHERE 1 = 1
		AND serial_no = @serial_no
		AND is_active = 'Y'

	IF @device_id > 0	
	BEGIN
		SELECT 
			 @generated_qrs_id = [id] 
			,@credit_amount = balance_amt 
		FROM dbo.generated_qrs 
		WHERE 1 = 1 
		AND is_active = 'Y' 
		AND hash_key = @hash_key1
		AND hash_key2 = @hash_key2;

		IF @generated_qrs_id IS NOT NULL
		BEGIN
			SET @total_amount = ISNULL(@regular_amount, 0) + ISNULL(@student_amount, 0) + ISNULL(@senior_amount, 0) + ISNULL(@pwd_amount, 0);
			SELECT @consumer_id = consumer_id, @mobile_no = mobile_no FROM dbo.consumers WHERE qr_id=@generated_qrs_id;
		
				IF @credit_amount >= @total_amount
				BEGIN
					SELECT
						@vehicle_id = vehicle_id
					   ,@client_id  = company_id
					FROM dbo.active_vehicles_v WHERE 1 = 1
					AND hash_key = @vehicle_hash_key;

					SELECT 
						@trip_id = trip_id
					FROM dbo.vehicle_trips WHERE 1 = 1
					AND trip_hash_key = @trip_hash_key;

					BEGIN TRAN;

					SET @new_credit_amount = @credit_amount - @total_amount;

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
						, [qr_id]
						, [base_fare]
						, [client_id]
						, [device_id]
						, [trip_id]
						, [payment_key]
						, [pao_id]
						, [route_id]
						, [from_location]
						, [to_location]
						, [no_klm]
						, [qr_ref_no]
						, [start_km]
						, [end_km]
						, [or_no]
					)
					VALUES(
						DATEADD(HOUR, 8, GETUTCDATE())
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
						, @generated_qrs_id
						, @base_fare
						, @client_id
						, @device_id
						, @trip_id
						, @new_id
						, @pao_id
						, @route_id
						, @from_location
						, @to_location
						, @travel_distance
						, 'ZP' + replace(cast(rand() * + 1000000 as NVARCHAR(6)),'.',0)
						, @start_km
						, @end_km
						, @or_number
					)
			        
					IF @@ERROR <> 0
					BEGIN
						SET @error = 1;
					END

					IF @error = 0
					BEGIN
						UPDATE 
							dbo.generated_qrs_active_v 
						SET
							  [balance_amt] = @new_credit_amount
							, [updated_by] = @consumer_id
							, [updated_date] = DATEADD(HOUR, 8, GETUTCDATE())
						WHERE 1 = 1
						AND id = @generated_qrs_id;

						IF @consumer_id IS NOT NULL
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
							   , DATEADD(HOUR, 8, GETUTCDATE()))

						COMMIT;

						SELECT 
							'Y' AS is_valid
							, 'Payment successful.' AS msg
							, @new_id AS payment_key
							, @or_number AS or_no
					END
					ELSE
					BEGIN
						ROLLBACK;

						SELECT 
							'N' AS is_valid
							, 'An error occurred while processing the payment.' AS msg
							, '' AS payment_key
							, '' AS or_no
					END
				END
				ELSE
				BEGIN
					SELECT 
						'N' AS is_valid
						, 'User has insufficient balance. Current balance is ' + CAST(@credit_amount AS NVARCHAR(100)) + '.' AS msg
						, '' AS payment_key
						, '' AS or_no
				END
			END
			ELSE
			BEGIN
				SELECT 
					'N' AS is_valid
					, 'QR Not found.' AS msg
					, '' AS payment_key
					, '' AS or_no
			END
	END
	ELSE
	BEGIN
		SELECT 
			'N' AS is_valid
			, 'Device is not registered to process payment.' AS msg
			, '' AS payment_key
			, 0 AS current_balance_amount
			, '' AS or_no
	END
END;