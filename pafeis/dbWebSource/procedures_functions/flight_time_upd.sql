CREATE PROCEDURE [dbo].[flight_time_upd]
(
    @tt    flight_time_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  flight_take_off_time	= b.flight_take_off_time
		,flight_landing_time	= b.flight_landing_time
		,no_hours				= convert(decimal(10,2),DATEDIFF(MINUTE,b.flight_take_off_time,b.flight_landing_time) / 60.0)
		,is_engine_off			= b.is_engine_off
		,remarks				= b.remarks
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.flight_time a INNER JOIN @tt b
    ON a.flight_operation_detail_id = b.flight_operation_detail_id
    WHERE isnull(b.is_edited,'N')='Y'
	   
-- Insert Process
    INSERT INTO dbo.flight_time(
         flight_operation_id
		,flight_take_off_time
		,flight_landing_time
		,no_hours
		,is_engine_off
		,remarks
        ,created_by
        ,created_date
        )
    SELECT 
         flight_operation_id
		,flight_take_off_time
		,flight_landing_time
		,convert(decimal(10,2),DATEDIFF(MINUTE,flight_take_off_time,flight_landing_time) / 60.0)
		,is_engine_off
		,remarks
		,@user_id
       ,GETDATE()
    FROM @tt
    WHERE flight_operation_detail_id IS NULL;
END

