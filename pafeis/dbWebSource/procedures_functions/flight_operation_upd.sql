
CREATE PROCEDURE [dbo].[flight_operation_upd]
(
    @tt    flight_operation_tt READONLY
   ,@user_id int
)
AS

BEGIN
   SET NOCOUNT ON
   DECLARE @id INT;
   DECLARE @statusId INT;
   DECLARE @statusName VARCHAR(20)


-- Update Process
    UPDATE a 
    SET  flight_operation_code		= b.flight_operation_code
		,flight_operation_name		= b.flight_operation_code
		,flight_operation_type_id	= b.flight_operation_type_id
		,flight_schedule_date		= b.flight_schedule_date
		,unit_id					= b. unit_id
		,aircraft_id				= b.aircraft_id
		,pilot_id					= b.pilot_id
		,co_pilot_id				= b.co_pilot_id
		,origin						= b.origin
		,destination				= b.destination
		,status_id					= b.status_id
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.flight_operation a INNER JOIN @tt b
    ON a.flight_operation_id = b.flight_operation_id
    WHERE (
			isnull(a.flight_operation_code,'')		<> isnull(b.flight_operation_code,'')  
		OR	isnull(a.flight_operation_name,'')		<> isnull(b.flight_operation_name,'')  
		OR	isnull(a.flight_operation_type_id,0)	<> isnull(b.flight_operation_type_id,0)  
		OR	isnull(a.flight_schedule_date,'')		<> isnull(b.flight_schedule_date,'')  
		OR	isnull(a.unit_id,0)						<> isnull(b.unit_id,0)  
		OR	isnull(a.aircraft_id,0)					<> isnull(b.aircraft_id,0)  
		OR	isnull(a.pilot_id,0)					<> isnull(b.pilot_id,0)  
		OR	isnull(a.co_pilot_id,0)					<> isnull(b.co_pilot_id,0)  
		OR	isnull(a.origin,'')						<> isnull(b.origin,'')  
		OR	isnull(a.destination,'')				<> isnull(b.destination,'')  
		OR	isnull(a.status_id,0)					<> isnull(b.status_id,0)   
	)
	   
-- Insert Process
    INSERT INTO dbo.flight_operation(
         flight_operation_code
		,flight_operation_name
		,flight_operation_type_id
		,flight_schedule_date
		,unit_id
		,aircraft_id
		,pilot_id
		,co_pilot_id
		,origin
		,destination
		,status_id
        ,created_by
        ,created_date
        )
    SELECT 
         flight_operation_code
		,flight_operation_name
		,flight_operation_type_id
		,flight_schedule_date
		,unit_id
		,aircraft_id
		,pilot_id
		,co_pilot_id
		,origin
		,destination
		,status_id
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE flight_operation_id IS NULL;
END

	SELECT @id = flight_operation_id, @statusId=status_id, @statusName=dbo.getStatusByPageProcessActionId(status_id) FROM @tt;
	IF ISNULL(@id,0) = 0
	   SET @id = @@IDENTITY
    --SELECT @id=doc_id FROM doc_routings WHERE doc_routing_id = @@IDENTITY;
	--EXEC dbo.doc_routing_process_upd 70,@id,@statusId,@user_id;

	RETURN @id



