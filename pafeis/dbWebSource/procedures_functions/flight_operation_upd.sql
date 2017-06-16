



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
   DECLARE @proc_tt AS TABLE (
     id int IDENTITY
	,proc_name varchar(50)
   )
   DECLARE @data_count INT;
   DECLARE @ctr int=0;
   DECLARE @procName VARCHAR(50)
   DECLARE @statusName VARCHAR(20)

-- Update Process
    UPDATE a 
    SET  flight_operation_code		= b.flight_operation_code
	    ,station_id                 = b.station_id
		,flight_schedule_date		= b.flight_schedule_date
		,aircraft_id				= b.aircraft_id
		,itinerary					= b.itinerary
		,ms_essential				= b.ms_essential
		,ms_category_id				= b.ms_category_id
		,ms_type_id					= b.ms_type_id
		,ms_detail_id				= b.ms_detail_id
		,flt_cond					= b.flt_cond
		,sort						= b.sort		
		,pax_mil					= b.pax_mil
		,pax_civ					= b.pax_civ
		,fnt_mil					= b.fnt_mil
		,fnt_civ					= b.fnt_civ
		,cargo						= b.cargo
		,gas_up_loc 				= b.gas_up_loc 
		,gas_up						= b.gas_up
		,gas_bal					= b.gas_bal
		,remarks                    = b.remarks
		,status_id					= b.status_id
		,no_cycles					= b.no_cycles
		,updated_by				    = @user_id
        ,updated_date			    = GETDATE()
		
    FROM dbo.flight_operation a INNER JOIN @tt b
    ON a.flight_operation_id = b.flight_operation_id
    WHERE isnull(b.is_edited,'N')='Y'
	   
-- Insert Process
    INSERT INTO dbo.flight_operation(
		 flight_operation_code
		,station_id           
		,flight_schedule_date
		,aircraft_id		
		,itinerary			
		,ms_essential		
		,ms_category_id		
		,ms_type_id			
		,ms_detail_id		
		,flt_cond			
		,sort				
		,pax_mil			
		,pax_civ			
		,fnt_mil			
		,fnt_civ			
		,cargo				
		,gas_up_loc 		
		,gas_up				
		,gas_bal			
		,remarks   
		,status_id
		,no_cycles           
		,created_by
        ,created_date
        )
    SELECT 
		 flight_operation_code
		,station_id           
		,flight_schedule_date
		,aircraft_id		
		,itinerary			
		,ms_essential		
		,ms_category_id		
		,ms_type_id			
		,ms_detail_id		
		,flt_cond			
		,sort				
		,pax_mil			
		,pax_civ			
		,fnt_mil			
		,fnt_civ			
		,cargo				
		,gas_up_loc 		
		,gas_up				
		,gas_bal			
		,remarks   
		,status_id
		,no_cycles           
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE flight_operation_id IS NULL;
END

	SELECT @id = flight_operation_id, @statusId=status_id, @statusName=dbo.getStatusByPageProcessActionId(status_id) FROM @tt;
	IF ISNULL(@id,0) = 0
	BEGIN
	   SELECT @id=doc_id FROM doc_routings WHERE doc_routing_id = @@IDENTITY;
	   EXEC dbo.doc_routing_process_upd 82,@id,@statusId,@user_id;
	   RETURN @id
	END;

	INSERT INTO @proc_tt SELECT proc_name FROM dbo.page_process_action_procs WHERE page_process_action_id=@statusId 
	SELECT @data_count =COUNT(*) FROM @proc_tt 
	WHILE @ctr < @data_count 
	BEGIN
	  SELECT TOP 1 @procName =proc_name FROM @proc_tt WHERE id> @ctr;
	  EXEC @procName @id,@user_id
	  SET @ctr = @ctr + 1
	END

	EXEC dbo.doc_routing_process_upd 82,@id,@statusId,@user_id;








