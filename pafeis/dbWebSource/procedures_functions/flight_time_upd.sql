CREATE PROCEDURE [dbo].[flight_time_upd]
(
    @tt    flight_time_tt READONLY
   ,@user_id int
)
AS

BEGIN
DECLARE @flight_operation_id INT
DECLARE @ttl_hours decimal(10,2)
-- Update Process
    UPDATE a 
    SET  engine_start	        = b.engine_start
		,engine_shutdown	    = b.engine_shutdown
		,no_hours				= convert(decimal(10,2),DATEDIFF(MINUTE,b.engine_start,b.engine_shutdown) / 60.0)
		,remarks				= b.remarks
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.flight_time a INNER JOIN @tt b
    ON a.flight_operation_detail_id = b.flight_operation_detail_id
    WHERE isnull(b.is_edited,'N')='Y'

   
-- Insert Process
    INSERT INTO dbo.flight_time(
         flight_operation_id
		,engine_start
		,engine_shutdown
		,no_hours
		,remarks
        ,created_by
        ,created_date
        )
    SELECT 
         flight_operation_id
		,engine_start
		,engine_shutdown
		,convert(decimal(10,2),DATEDIFF(MINUTE,engine_start,engine_shutdown) / 60.0)
		,remarks
		,@user_id
       ,GETDATE()
    FROM @tt
    WHERE flight_operation_detail_id IS NULL
	AND flight_operation_id IS NOT NULL
	AND engine_start IS NOT NULL
	AND engine_shutdown IS NOT NULL;

	SELECT TOP 1 @flight_operation_id = flight_operation_id FROM @tt;
    SELECT @ttl_hours = SUM(no_hours) FROM @tt;
    UPDATE dbo.flight_operation SET total_hours = @ttl_hours WHERE flight_operation_id = @flight_operation_id;


END

