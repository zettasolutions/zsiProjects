
CREATE PROCEDURE [dbo].[receiving_upd]
(
    @tt    receiving_tt READONLY
   ,@user_id int
)
AS

BEGIN
   SET NOCOUNT ON
   DECLARE @id INT;
   DECLARE @page_process_action_id INT;
   DECLARE @proc_tt AS TABLE (
     id int IDENTITY
	,proc_name varchar(50)
   )
   DECLARE @data_count INT;
   DECLARE @ctr int=0;
   DECLARE @procName NVARCHAR(50)
   DECLARE @statusName NVARCHAR(50)
   DECLARE @warehouse_id int
   DECLARE @remarks NVARCHAR(MAX)

   select @warehouse_id = dbo.getUserWarehouseId(@user_id);

-- Update Process
    UPDATE a 
    SET 
         procurement_id             = b.procurement_id
	    ,doc_no						= b.doc_no			
	    ,doc_date					= b.doc_date		
	    ,dealer_id					= b.dealer_id		
		,aircraft_id                = b.aircraft_id
		,donor                      = b.donor
		,supply_source_id           = b.supply_source_id
		,received_by				= b.received_by
		,received_date				= b.received_date
		,status_id                  = b.status_id
		,status_remarks				= b.status_remarks
		,updated_by					= @user_id
        ,updated_date				= GETDATE()
    FROM dbo.receiving a INNER JOIN @tt b
    ON a.receiving_id = b.receiving_id
    WHERE isnull(b.is_edited,'N')='Y' OR a.status_id<>b.status_id
	   
-- Insert Process

    INSERT INTO dbo.receiving (    
		doc_no			
		,doc_date	
		,receiving_no	
		,dealer_id		
		,aircraft_id
		,donor
		,supply_source_id
		,warehouse_id
		,received_by
		,received_date
		,status_id
		,status_remarks
		,receiving_type
		,procurement_id
		,created_by
		,created_date
        )
    SELECT 
		doc_no			
		,doc_date	
		 ,concat(dbo.getWarehouseCode(@warehouse_id),'-',cast(Year(getDate()) as varchar(20)),'-',dbo.getWarehouseRRNo(@warehouse_id))	
		,dealer_id	
		,aircraft_id
		,donor
		,supply_source_id
		,dbo.getUserWarehouseId(@user_id)
		,received_by
		,received_date
		,status_id
		,status_remarks
		,receiving_type
		,procurement_id
	   ,@user_id
	   ,GETDATE()
    FROM @tt
    WHERE receiving_id IS NULL
	AND doc_no IS NOT NULL
	AND @warehouse_id IS NOT NULL
	--AND (dealer_id IS NOT NULL OR aircraft_id IS NOT NULL OR transfer_warehouse_id IS NOT NULL)

	SELECT @id = receiving_id, @page_process_action_id=page_process_action_id, @remarks=status_remarks FROM @tt;
	IF ISNULL(@id,0) = 0
	BEGIN
	   SELECT @id=doc_id FROM doc_routings WHERE doc_routing_id = @@IDENTITY;
	   EXEC dbo.doc_routing_process_upd 70,@id,@page_process_action_id,@user_id;
	   RETURN @id
	END;

	INSERT INTO @proc_tt SELECT proc_name FROM dbo.page_process_action_procs WHERE page_process_action_id=@page_process_action_id 
	SELECT @data_count =COUNT(*) FROM @proc_tt 
	WHILE @ctr < @data_count 
	BEGIN
	  SELECT TOP 1 @procName =proc_name FROM @proc_tt WHERE id> @ctr;
	  EXEC @procName @id,@user_id
	  SET @ctr = @ctr + 1
	END

	IF (SELECT COUNT(*) FROM dbo.receiving_details WHERE receiving_id=@id) > 0
	    EXEC dbo.doc_routing_process_upd 70,@id,@remarks,@page_process_action_id,@user_id;
END





