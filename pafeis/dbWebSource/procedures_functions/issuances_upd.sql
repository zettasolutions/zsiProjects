
CREATE PROCEDURE [dbo].[issuances_upd]
(
    @tt    issuances_tt READONLY
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
   DECLARE @procName NVARCHAR(100)
   DECLARE @statusName NVARCHAR(50)
   DECLARE @warehouse_id int
   DECLARE @remarks NVARCHAR(MAX)

   select @warehouse_id = dbo.getUserWarehouseId(@user_id);

-- Update Process
    UPDATE a 
    SET  issuance_no			= b.issuance_no		
		,issued_by				= b.issued_by
		,issued_date			= b.issued_date
		,issuance_directive_code	= b.issuance_directive_code
		,aircraft_id			= b.aircraft_id
		,transfer_warehouse_id	= b.transfer_warehouse_id
		,status_id				= b.status_id
		,status_remarks			= b.status_remarks
		,authority_ref			= b.authority_ref
		,accepted_by            = b.accepted_by
		,issued_to_organization_id=b.issued_to_organization_id
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.issuances a INNER JOIN @tt b
    ON a.issuance_id = b.issuance_id
    WHERE isnull(b.is_edited,'N')='Y' OR a.status_id <> b.status_id
   
-- Insert Process

    INSERT INTO dbo.issuances (
		organization_id		
		,issuance_no 
		,issued_by
		,issued_date
		,issuance_directive_code
		,aircraft_id
		,transfer_warehouse_id
		,dealer_id
		,status_id
		,status_remarks
		,authority_ref
		,warehouse_id
		,accepted_by
		,issued_to_organization_id
		,issuance_type
		,created_by
		,created_date
        )
    SELECT 
	    dbo.getUserOrganizationId(@user_Id)	
	   ,concat(dbo.getWarehouseCode(@warehouse_id),'-',cast(Year(getDate()) as varchar(20)),'-',dbo.getWarehouseISNo(@warehouse_id)) 
	   ,issued_by
	   ,issued_date
	   ,issuance_directive_code
	   ,aircraft_id
	   ,transfer_warehouse_id
	   ,dealer_id
	   ,status_id
	   ,status_remarks
	   ,authority_ref
	   ,dbo.getUserWarehouseId(@user_id)
	   ,accepted_by
	   ,issued_to_organization_id
	   ,issuance_type
	   ,@user_id
	   ,GETDATE()
    FROM @tt
    WHERE isnull(issuance_id,0) = 0
	AND dbo.getWarehouseCode(@warehouse_id) IS NOT NULL

--	AND (aircraft_id IS NOT NULL OR transfer_warehouse_id IS NOT NULL OR dealer_id IS NOT NULL);

	SELECT @id = issuance_id,  @page_process_action_id=page_process_action_id, @remarks=status_remarks FROM @tt;
	IF ISNULL(@id,0) = 0
	BEGIN
		SELECT @id=doc_id FROM doc_routings WHERE doc_routing_id = @@IDENTITY;
		EXEC dbo.doc_routing_process_upd 66,@id,@page_process_action_id,@user_id;
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

	EXEC dbo.doc_routing_process_upd 66,@id,@remarks, @page_process_action_id,@user_id;

END






