CREATE PROCEDURE vehicle_trip_upd(
  @trip_no INT=NULL 
 ,@vehicle_hash_key NVARCHAR(50)
 ,@driver_hash_key NVARCHAR(50)
 ,@start_odo  int=NULL
 ,@end_odo    int=NULL
 ,@user_id    int
)
AS
BEGIN
 DECLARE @error		 INT = 0;
 DECLARE @trip_id    INT
 DECLARE @l_trip_no  INT
 DECLARE @vehicle_id INT
 DECLARE @driver_id  INT
 DECLARE @l_end_date varchar(10)
 DECLARE @l_start_date DATE
 DECLARE @cur_date varchar(10) = convert(VARCHAR(10),DATEADD(HOUR, 8, GETUTCDATE()),101);
 SELECT @vehicle_id=vehicle_id FROM dbo.active_vehicles_v WHERE hash_key= @vehicle_hash_key;
 SELECT @driver_id=user_id FROM dbo.drivers_v WHERE hash_key =@driver_hash_key;
 IF ISNULL(@trip_no,0)=0
	 BEGIN
			SELECT TOP 1 @l_trip_no = trip_no
				  ,@l_end_date = convert(varchar(10), end_date, 101)
			  FROM dbo.vehicle_trips 
			 WHERE vehicle_id=@vehicle_id ORDER BY trip_no DESC; 

		SET @l_start_date=DATEADD(HOUR, 8, GETUTCDATE())
		IF @l_end_date=@cur_date
		   SET @l_trip_no = @l_trip_no + 1
		ELSE
		   SET @l_trip_no=1
 
		INSERT INTO dbo.vehicle_trips (trip_no, trip_date, vehicle_id, driver_id, start_date, start_odo, start_by)
			  VALUES (@trip_no,@cur_date,@vehicle_id,@driver_id,@l_start_date,@start_odo, @user_id)
			
        
		SELECT @trip_no, @vehicle_hash_key, @driver_hash_key, @l_start_date, @start_odo

	END
	ELSE
	BEGIN
	   SELECT TOP 1 @trip_id = trip_id FROM dbo.vehicle_trips WHERE trip_no = @trip_no and vehicle_id = @vehicle_id ORDER BY trip_id DESC;
	   UPDATE dbo.vehicle_trips SET end_odo = @end_odo, end_date = DATEADD(HOUR, 8, GETUTCDATE()) WHERE trip_id = @trip_id;

		IF @error = 0
		BEGIN
			COMMIT;
			SELECT 'Trip.' + cast(@trip_no as varchar(10)) + ' is now close.' AS msg
		END

    END;
	
END
