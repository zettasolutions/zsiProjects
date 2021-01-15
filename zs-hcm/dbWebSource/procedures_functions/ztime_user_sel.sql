

CREATE PROCEDURE [dbo].[ztime_user_sel]  
(     @device_hash_key NVARCHAR(MAX)
	 ,@client_hash_key NVARCHAR(MAX)
    , @emp_hash_key NVARCHAR(MAX)
	, @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @stmt NVARCHAR(MAX);
    DECLARE @client_id  INT;
	DECLARE @tbl_employees NVARCHAR(50);
	DECLARE @tbl_dtr NVARCHAR(50);

	DECLARE @employee_id INT;
	DECLARE @first_name NVARCHAR(50);
	DECLARE @last_name NVARCHAR(50);
	DECLARE @position NVARCHAR(50);
	DECLARE @img_filename NVARCHAR(MAX);
	DECLARE @is_active CHAR(1);
	DECLARE @device_id int;
	
	SELECT @device_id = device_id FROM dbo.devices_v WHERE hash_key = @device_hash_key;
	SELECT @client_id = client_id FROM dbo.clients_v WHERE 1 = 1 AND hash_key = @client_hash_key;
	SET @tbl_employees = CONCAT('dbo.employees_', @client_id, '_v');
	SET @tbl_dtr = CONCAT('dbo.dtr_', @client_id);

	SET @stmt = CONCAT(
		'SELECT
			@employee_id = id
			, @first_name = first_name
			, @last_name = last_name
			, @position = position_title
			, @img_filename = ISNULL(img_filename, '''')
			, @is_active = is_active
		FROM ', @tbl_employees, ' WHERE 1 = 1 AND emp_hash_key = ''', @emp_hash_key, ''''
	);
	--print @stmt;
	EXEC sp_executesql @stmt, N'
			@employee_id INT OUTPUT
			, @first_name NVARCHAR(50) OUTPUT
			, @last_name NVARCHAR(50) OUTPUT
			, @position NVARCHAR(50) OUTPUT
			, @img_filename NVARCHAR(MAX) OUTPUT
			, @is_active CHAR(1) OUTPUT'
		, @employee_id OUTPUT
		, @first_name OUTPUT
		, @last_name OUTPUT
		, @position OUTPUT
		, @img_filename OUTPUT
		, @is_active OUTPUT;

	IF @employee_id IS NOT NULL
	BEGIN
		--SELECT TOP 1 * FROM dtr_1 where 1=1 and employee_id = 1 and dt_in is not null order by id desc;
		DECLARE @dtr_sql NVARCHAR(MAX);
		DECLARE @error INT = 0;
		DECLARE @dtr_id INT;
		DECLARE @dt_in DATETIME;

		-- Get the record of the employee that has a time in.
		SET @dtr_sql = CONCAT(
			'SELECT TOP 1 @dtr_id = id, @dt_in = dt_in FROM '
			, @tbl_dtr
			, ' WHERE 1 = 1 AND employee_id = '''
			, @employee_id
			, ''''
			, ' AND dt_in IS NOT NULL AND dt_out IS NULL ORDER BY id DESC '
		);
		--print @dtr_sql;
		EXEC sp_executesql @dtr_sql, N'
				@dtr_id INT OUTPUT, @dt_in DATETIME OUTPUT'
			, @dtr_id OUTPUT
			, @dt_in OUTPUT;

		-- If time in is null, create a time in record.
		IF @dtr_id IS NULL
		BEGIN
			DECLARE @new_dt_in DATETIME = DATEADD(HOUR,8,GETUTCDATE());
			DECLARE @new_dtr_date DATE = CONVERT(DATE, @new_dt_in);
			DECLARE @insert_sql NVARCHAR(MAX);

			BEGIN TRAN;
			SET @insert_sql = CONCAT('INSERT INTO ', @tbl_dtr,' (employee_id, dtr_date, in_device_id, dt_in) VALUES(',@employee_id,',''',@new_dtr_date,''',', @device_id,',''',CAST(@new_dt_in AS VARCHAR(20)),''')')
			print @insert_sql;
			EXEC sp_executesql @insert_sql, N'
					@error INT OUTPUT'
				, @error OUTPUT;
			
			IF @error = 0
			BEGIN
				COMMIT;

				SELECT
					'Y' AS is_valid
					, 'Success' AS msg
					, 'IN' AS [status]
					, @first_name AS first_name 
					, @last_name AS last_name 
					, @position  AS position 
					, @img_filename AS img_filename
					, FORMAT(@new_dt_in, 'MM/dd/yyyy hh:mm tt') AS dt_in
					, '' AS dt_out;
			END
			ELSE
			BEGIN
				ROLLBACK;

				SELECT
					'N' AS is_valid
					, 'Error3' AS msg
					, '' AS [status]
					, '' AS first_name 
					, '' AS last_name 
					, '' AS position 
					, '' AS img_filename
					, '' AS dt_in
					, '' AS dt_out;
			END
		END
		-- If time in is not null, update the time out record.
		ELSE
		BEGIN
			DECLARE @dt_out DATETIME = DATEADD(HOUR,8,GETUTCDATE());
			DECLARE @update_sql NVARCHAR(MAX);

			BEGIN TRAN;
			SET @update_sql = CONCAT('UPDATE ', @tbl_dtr, ' SET dt_out = ''',@dt_out,''',out_device_id =',@device_id,' WHERE 1 = 1 AND id = ', @dtr_id);
			EXEC sp_executesql @update_sql, N'
					@error INT OUTPUT'
				, @error OUTPUT;

			IF @error = 0
			BEGIN
				COMMIT;

				SELECT
					'Y' AS is_valid
					, 'Success' AS msg
					, 'OUT' AS [status]
					, @first_name AS first_name 
					, @last_name AS last_name 
					, @position  AS position 
					, @img_filename AS img_filename
					, FORMAT(@dt_in, 'MM/dd/yyyy hh:mm tt') AS dt_in
					, FORMAT(@dt_out, 'MM/dd/yyyy hh:mm tt') AS dt_out;
			END
			ELSE
			BEGIN
				ROLLBACK;

				SELECT
					'N' AS is_valid
					, 'Error2' AS msg
					, '' AS [status]
					, '' AS first_name 
					, '' AS last_name 
					, '' AS position 
					, '' AS img_filename
					, '' AS dt_in
					, '' AS dt_out;
			END
		END
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'Error1' AS msg
			, '' AS [status]
			, '' AS first_name 
			, '' AS last_name 
			, '' AS position 
			, '' AS img_filename
			, '' AS dt_in
			, '' AS dt_out;
	END
END;