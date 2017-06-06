CREATE PROCEDURE [dbo].[flight_operation_pilots_upd]
(
    @tt    flight_operation_pilots_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  pilot_id	        = b.pilot_id
		,duty	            = b.duty
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.flight_operation_pilots a INNER JOIN @tt b
    ON a.flight_operation_pilot_id = b.flight_operation_pilot_id
    WHERE isnull(b.is_edited,'N')='Y'

   
-- Insert Process
    INSERT INTO dbo.flight_operation_pilots(
         flight_operation_id
		,pilot_id
		,duty
        ,created_by
        ,created_date
        )
    SELECT 
         flight_operation_id
		,pilot_id
		,duty
		,@user_id
       ,GETDATE()
    FROM @tt
    WHERE flight_operation_pilot_id IS NULL
	AND pilot_id IS NOT NULL;




END

