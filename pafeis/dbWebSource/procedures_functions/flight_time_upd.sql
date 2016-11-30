
CREATE PROCEDURE [dbo].[flight_time_upd]
(
    @tt    flight_time_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  flight_operation_id	= b.flight_operation_id
		,flight_take_off_time	= b.flight_take_off_time
		,flight_landing_time	= b.flight_landing_time
		,is_engine_off			= b.is_engine_off
		,no_hours				= DATEDIFF(MINUTE,b.flight_take_off_time,b.flight_landing_time) / 60
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.flight_time a INNER JOIN @tt b
    ON a.flight_time_id = b.flight_time_id
    WHERE (
			isnull(a.flight_operation_id,'')		<> isnull(b.flight_operation_id,'')  
		OR	isnull(a.flight_take_off_time,'')		<> isnull(b.flight_take_off_time,'')  
		OR	isnull(a.flight_landing_time,'')		<> isnull(b.flight_landing_time,0)  
		OR	isnull(a.is_engine_off,'')				<> isnull(b.is_engine_off,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.flight_time(
         flight_operation_id
		,flight_take_off_time
		,flight_landing_time
		,is_engine_off
		,no_hours
        ,created_by
        ,created_date
        )
    SELECT 
         flight_operation_id
		,flight_take_off_time
		,flight_landing_time
		,is_engine_off
		,DATEDIFF(MINUTE,flight_take_off_time,flight_landing_time) / 60
		,@user_id
       ,GETDATE()
    FROM @tt
    WHERE flight_time_id IS NULL;
END
