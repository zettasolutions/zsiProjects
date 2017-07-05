
CREATE PROCEDURE [dbo].[physical_inv_upd]
(
    @tt    physical_inv_tt READONLY
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
   DECLARE @warehouse_id int

   select @warehouse_id = dbo.getUserWarehouseId(@user_id);
-- Update Process
    UPDATE a 
    SET  physical_inv_date					= b.physical_inv_date		
		,done_by					        = b.done_by
		,warehouse_id					    = b.warehouse_id
		,status_id							= b.status_id
		,status_remarks                     = b.status_remarks
		,updated_by							= @user_id
        ,updated_date						= GETDATE()
    FROM dbo.physical_inv a INNER JOIN @tt b
    ON a.physical_inv_id = b.physical_inv_id
    WHERE isnull(b.is_edited,'N')='Y' OR a.status_id <> b.status_id
   
-- Insert Process

    INSERT INTO dbo.physical_inv (
		 physical_inv_date				
		,done_by				
		,warehouse_id 
		,physical_inv_no
		,status_id
		,status_remarks						
		,created_by
		,created_date
        )
    SELECT 
		 physical_inv_date				
		,done_by				
		,dbo.getUserWarehouseId(@user_id) 
		,concat(dbo.getWarehouseCode(@warehouse_id),'-',cast(Year(getDate()) as varchar(20)),'-',dbo.getWarehousePINo(@warehouse_id))	
		,status_id
		,status_remarks								
	    ,@user_id
	    ,GETDATE()
    FROM @tt
    WHERE isnull(physical_inv_id,0) = 0
	

	SELECT @id = physical_inv_id, @page_process_action_id=page_process_action_id FROM @tt;
	IF ISNULL(@id,0) = 0
	BEGIN
		SELECT @id=doc_id FROM doc_routings WHERE doc_routing_id = @@IDENTITY;
		EXEC dbo.doc_routing_process_upd 1113,@id,@page_process_action_id,@user_id;
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

	EXEC dbo.doc_routing_process_upd 1113,@id,@page_process_action_id,@user_id;

END


