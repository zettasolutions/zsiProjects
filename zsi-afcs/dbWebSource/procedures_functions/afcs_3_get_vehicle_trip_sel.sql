
CREATE PROCEDURE [dbo].[afcs_3_get_vehicle_trip_sel](
	@vehicle_hash_key NVARCHAR(50)
	, @user_id    INT = NULL
)
AS
BEGIN
	DECLARE @trip_no INT;
	DECLARE @vehicle_plate_no NVARCHAR(20);
	DECLARE @start_odo  INT;
	DECLARE @is_open CHAR(1) = 'N';
	DEClARE @start_date DATE; 
	DECLARE @vehicle_id INT;
	DECLARE @trip_hash_key NVARCHAR(50);
  
	SELECT 
		@vehicle_id = vehicle_id
		, @vehicle_plate_no = vehicle_plate_no 
	FROM dbo.active_vehicles_v 
	WHERE 1 = 1
	AND hash_key = @vehicle_hash_key;
	
	SELECT 
		TOP 1 
		@trip_no = trip_no
		, @is_open = is_open
		, @start_odo = start_odo
		, @start_date = [start_date]
		, @trip_hash_key = trip_hash_key 
	FROM dbo.vehicle_trips 
	WHERE 1 = 1
	AND vehicle_id = @vehicle_id 
	ORDER BY 
		trip_id DESC;


	IF ISNULL(@is_open, 'N') = 'Y'
	BEGIN
		SELECT @vehicle_plate_no vehicle_plate_no
			, @trip_no trip_no
			, @start_odo start_odo
			, @is_open is_open
			, @trip_hash_key trip_hash_key
	END
	ELSE
	BEGIN
		IF CAST(@start_date AS DATE) = CAST(DATEADD(HOUR, 8, GETUTCDATE()) AS DATE)
		BEGIN
			SELECT @vehicle_plate_no vehicle_plate_no
				, @trip_no + 1 trip_no
				, '' start_odo
				, 'Y' AS is_open
				, '' trip_hash_key
		END
		ELSE
		BEGIN
			SELECT @vehicle_plate_no vehicle_plate_no
				, 1 AS trip_no
				, '' start_odo
				, 'Y' AS is_open
				, @trip_hash_key trip_hash_key
		END     
	END
END