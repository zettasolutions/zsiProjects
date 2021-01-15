


CREATE PROCEDURE [dbo].[afcs_legacy_driver_upd]  
(  
    @vehicle_hash_key NVARCHAR(MAX)
	, @device_hash_key NVARCHAR(MAX)
	, @driver_hash_key NVARCHAR(MAX)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @client_id INT;
	DECLARE @device_id INT;
	DECLARE @is_active CHAR(1);
	DECLARE @driver_id INT;
	DECLARE @tbl_employees NVARCHAR(100)
	DECLARE @tbl_dtr NVARCHAR(50);
	DECLARE @stmt NVARCHAR(MAX);
	DECLARE @insert_sql NVARCHAR(MAX);
	DECLARE @error INT = 0;
	DECLARE @update_sql NVARCHAR(MAX);
    DECLARE @hour INT;
	DECLARE @active_vehicle_driver_id INT;

    SELECT @hour = add_hour FROM dbo.app_profile
	SELECT @client_id = company_id FROM dbo.active_vehicles_v WHERE 1 = 1 AND hash_key = @vehicle_hash_key;
	SET @tbl_employees = CONCAT('zsi_hcm.dbo.employees_', @client_id);
	SET @tbl_dtr = CONCAT('zsi_hcm.dbo.dtr_', @client_id);

	SELECT @device_id = device_id FROM dbo.devices WHERE 1 = 1
	AND hash_key = @device_hash_key
	AND is_active = 'Y';

	DECLARE @dt_in DATETIME = DATEADD(HOUR, @hour, GETUTCDATE());
	DECLARE @dtr_date DATE = CONVERT(DATE, @dt_in);

	SELECT @active_vehicle_driver_id = driver_id FROM dbo.active_vehicles_v WHERE 1 = 1 AND hash_key = @vehicle_hash_key;
	IF @active_vehicle_driver_id IS NULL -- No driver is currently logged in.
	BEGIN
		SET @stmt = CONCAT(
			'SELECT
				@driver_id = id
			FROM ', @tbl_employees, ' WHERE 1 = 1 AND emp_hash_key = ''', @driver_hash_key, ''''
		);
		EXEC sp_executesql @stmt, N'
				@driver_id INT OUTPUT'
			, @driver_id OUTPUT;

		IF @driver_id IS NOT NULL
		BEGIN
			BEGIN TRAN;

			-- Update the previous login of a driver in another device
			-- in case the driver logs into another device.
			SET @update_sql = CONCAT('UPDATE ', @tbl_dtr,' SET out_device_id = ', @device_id, ', dt_out = ', CAST(@dt_in AS VARCHAR(20)) 
				, ' WHERE 1 = 1 AND employee_id = ', @driver_id, ' AND in_device_id <> ', @device_id
				, ' AND dt_in IS NOT NULL AND out_device_id IS NULL AND dt_out IS NULL');

			SET @insert_sql = CONCAT('INSERT INTO ', @tbl_dtr,' (employee_id, dtr_date, in_device_id, dt_in) 
				VALUES(', @driver_id,',''', @dtr_date,''',', @device_id,',''', CAST(@dt_in AS VARCHAR(20)),''')');
			EXEC(@insert_sql);

			IF @@ERROR = 0
			BEGIN
				SET @error = 0;
				COMMIT;
			END
			ELSE
			BEGIN
				SET @error = 1;
				ROLLBACK;
			END
		END

		IF @error = 0
		BEGIN
			SELECT
				'Y' AS is_valid
				, 'The driver is logged in successfully.' AS msg

			-- Update the devices table and save the driver_id.
			UPDATE dbo.devices SET driver_id = @driver_id, updated_date = GETDATE() WHERE 1 = 1 AND device_id = @device_id;

			-- Update the vehicles table and save the driver_id.
			UPDATE zsi_fmis.dbo.vehicles SET driver_id = @driver_id WHERE 1 = 1 AND hash_key = @vehicle_hash_key;
		END
		ELSE
		BEGIN
			SELECT
				'N' AS is_valid
				, 'Sorry, something went wrong while saving the driver info.' AS msg
		END
	END
	ELSE -- Driver is currently logged in.
	BEGIN
		SELECT
			'N' AS is_valid
			, 'Unable to log in. A driver is already logged in with the current vehicle.' AS msg
	END
END;