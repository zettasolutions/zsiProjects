
CREATE PROCEDURE [dbo].[procurement_upd]
(
    @tt    procurement_tt READONLY
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
   DECLARE @procName VARCHAR(50)
   DECLARE @statusName VARCHAR(20)

-- Update Process
    UPDATE a 
    SET  procurement_code					= b.procurement_code		
		,procurement_date					= b.procurement_date
		,po_code					        = b.po_code		
		,po_date					        = b.po_date
		,bac_code					        = b.bac_code		
		,bac_date					        = b.bac_date
		,procurement_name					= b.procurement_name
		,procurement_mode					= b.procurement_mode
		,supplier_id						= b.supplier_id
		,promised_delivery_date				= b.promised_delivery_date
		,warehouse_id                       = b.warehouse_id
		,status_id							= b.status_id
		,updated_by							= @user_id
        ,updated_date						= GETDATE()
    FROM dbo.procurement a INNER JOIN @tt b
    ON a.procurement_id = b.procurement_id
    WHERE isnull(b.is_edited,'N')='Y' OR a.status_id <> b.status_id
   
-- Insert Process

    INSERT INTO dbo.procurement (
		 procurement_date				
		,procurement_code
		,po_code
		,po_date
		,bac_code
		,bac_date
		,procurement_name	
		,procurement_mode
		,organization_id			
		,supplier_id					
		,promised_delivery_date
		,warehouse_id 
		,procurement_type
		,status_id						
		,created_by
		,created_date
        )
    SELECT 
		 procurement_date				
		,procurement_code	
		,po_code
		,po_date
		,bac_code
		,bac_date			
		,procurement_name	
		,procurement_mode
		,dbo.getUserOrganizationId(@user_id)			
		,supplier_id					
		,promised_delivery_date
		,warehouse_id
		,procurement_type	
		,status_id						
	    ,@user_id
	    ,GETDATE()
    FROM @tt
    WHERE isnull(procurement_id,0) = 0
	AND procurement_code IS NOT NULL
	AND supplier_id IS NOT NULL

	SELECT @id = procurement_id, @page_process_action_id=page_process_action_id FROM @tt;
	IF ISNULL(@id,0) = 0
	BEGIN
		SELECT @id=doc_id FROM doc_routings WHERE doc_routing_id = @@IDENTITY;
		EXEC dbo.doc_routing_process_upd 1107,@id,@page_process_action_id,@user_id;
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

	EXEC dbo.doc_routing_process_upd 1107,@id,@page_process_action_id,@user_id;

END



