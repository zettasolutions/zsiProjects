CREATE PROCEDURE [dbo].[afcs_vehicle_trip_upd](
  @trip_hash_key    NVARCHAR(100)=NULL OUTPUT
 ,@trip_no			INT=NULL 
 ,@vehicle_hash_key NVARCHAR(100)
 ,@driver_hash_key	NVARCHAR(100)
 ,@pao_hash_key		NVARCHAR(100)
 ,@start_odo		INT=NULL
 ,@end_odo			INT=NULL
 ,@is_open			CHAR(1)=NULL
 ,@user_id			INT
)
AS
BEGIN
	DECLARE @error		 INT = 0;
	DECLARE @vehicle_id INT
	DECLARE @driver_id  INT
	DECLARE @pao_id     INT
	DECLARE @cur_date   DATE  = DATEADD(HOUR, 8, GETUTCDATE());
	DECLARE @msg        NVARCHAR(100);

	SELECT @vehicle_id=vehicle_id FROM dbo.active_vehicles_v WHERE hash_key= @vehicle_hash_key;
	SELECT @driver_id=user_id FROM dbo.drivers_active_v WHERE hash_key =@driver_hash_key;
	SELECT @pao_id=user_id FROM dbo.pao_active_v WHERE hash_key =@pao_hash_key;

	BEGIN TRAN;
	IF @is_open = 'Y'
	BEGIN
		INSERT INTO dbo.vehicle_trips (trip_no,start_date, start_odo,vehicle_id, driver_id,pao_id,trip_hash_key, is_open)
		values (@trip_no, @cur_date, @start_odo, @vehicle_id, @driver_id, @pao_id, newid(), 'Y')

		SELECT @trip_hash_key = trip_hash_key FROM dbo.vehicle_trips WHERE trip_id = @@IDENTITY;

		SET @msg='Trip No. ' + cast(@trip_no as varchar(10)) + ' is started.'
	END
	ELSE
	BEGIN
		UPDATE dbo.vehicle_trips SET end_date = @cur_date, end_odo=@end_odo, is_open='N' WHERE trip_hash_key = @trip_hash_key
		SET @msg='Trip No. ' + cast(@trip_no as varchar(10)) + ' is closed.'
	END;

	IF @@ERROR = 0
	BEGIN
		COMMIT;
		SELECT 
			@trip_hash_key
			, 'Y' is_valid
			, @msg AS msg
	END
	ELSE
	BEGIN
		ROLLBACK;
		SELECT 
			@trip_hash_key
			, 'N' is_valid
			, 'ERROR: Update not successful. Please try again.' AS msg
	END
END