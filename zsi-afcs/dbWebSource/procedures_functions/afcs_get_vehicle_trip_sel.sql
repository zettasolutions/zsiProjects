CREATE PROCEDURE [dbo].[afcs_get_vehicle_trip_sel](
  @vehicle_hash_key NVARCHAR(50)
 ,@user_id    int
)
AS
BEGIN
  DECLARE @trip_no int
  DECLARE @vehicle_plate_no nvarchar(20)
  DECLARE @start_odo  int
  DECLARE @is_open char(1)
  DEClARE @start_date date 
  DECLARE @vehicle_id INT
  DECLARE @trip_hash_key NVARCHAR(50)
  

  SELECT @vehicle_id=vehicle_id, @vehicle_plate_no=vehicle_plate_no FROM dbo.vehicles WHERE hash_key=@vehicle_hash_key;
  SELECT TOP 1 @trip_no = trip_no, @is_open=is_open, @start_odo=start_odo, @start_date=start_date, @trip_hash_key=trip_hash_key 
	FROM dbo.vehicle_trips WHERE vehicle_id = @vehicle_id order by trip_id desc;

  IF ISNULL(@is_open,'N') = 'Y'
     SELECT @vehicle_plate_no vehicle_plate_no
	       ,@trip_no trip_no
		   ,@start_odo start_odo
		   ,@is_open is_open
		   ,@trip_hash_key trip_hash_key
  ELSE
  BEGIN
     IF CONVERT(varchar(10),@start_date,101) = CONVERT(varchar(10),DATEADD(HOUR,8,GETUTCDATE()),101)
		SELECT @vehicle_plate_no vehicle_plate_no
			   ,@trip_no+1 trip_no
			   --,@start_odo start_odo
			   ,'' start_odo
			   ,'Y' AS is_open
			   --,@trip_hash_key trip_hash_key
			   ,'' trip_hash_key
	     
     ELSE
		SELECT @vehicle_plate_no vehicle_plate_no
			   ,1 AS trip_no
			   ,@start_odo start_odo
			   ,'Y' AS is_open
			   ,@trip_hash_key trip_hash_key

   END     
END