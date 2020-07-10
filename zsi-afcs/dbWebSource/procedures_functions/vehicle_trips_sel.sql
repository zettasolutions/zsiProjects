CREATE PROCEDURE [dbo].[vehicle_trips_sel](
   @client_id  INT
  ,@vehicle_id INT=NULL
  ,@driver_id  INT=NULL
  ,@trip_no    INT=NULL
  --,@start_date VARCHAR(10)
  --,@end_date   VARCHAR(10)
  ,@user_id	   INT = NULL
)
AS
BEGIN
DECLARE @stmt NVARCHAR(MAX)
SELECT @stmt = 'SELECT * FROM dbo.vehicle_trips_v WHERE client_id= ' + CAST(@client_id AS VARCHAR(20))

--IF ISNULL(@start_date,'') = '' AND ISNULL(@end_date,'')=''
--   SET @stmt = @stmt + ' AND CONVERT(varchar(10), start_date,101)=DATEADD(HOUR,8,GETUTCDATE())'
--ELSE
--   SET @stmt = @stmt + ' AND CONVERT(varchar(10), start_date,101) BETWEEN ''' + @start_date + ''' AND ''' + @end_date + '''';
IF ISNULL(@vehicle_id,0)<>0
   SET @stmt = @stmt + ' AND vehicle_id = ' + CAST(@vehicle_id AS VARCHAR(20))

IF ISNULL(@driver_id,0)<>0
   SET @stmt = @stmt + ' AND driver_id = ' + CAST(@driver_id AS VARCHAR(20))
  
IF ISNULL(@trip_no,0)<>0
   SET @stmt = @stmt + ' AND trip_no = ' + CAST(@trip_no AS VARCHAR(20))

EXEC(@stmt);
END

