


CREATE PROCEDURE [dbo].[adjustments_upd]
(
    @tt    adjustments_tt READONLY
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
   DECLARE @warehouse_id int

   select @warehouse_id = dbo.getUserWarehouseId(@user_id);

-- Update Process
    UPDATE a 
    SET 
	     adjustment_date			= b.adjustment_date		
	    ,adjustment_by				= b.adjustment_by		
		,warehouse_id               = b.warehouse_id
		,adjustment_remarks         = b.adjustment_remarks
		,status_id                  = b.status_id
		,updated_by					= @user_id
        ,updated_date				= GETDATE()
    FROM dbo.adjustments a INNER JOIN @tt b
    ON a.adjustment_id = b.adjustment_id
    WHERE isnull(b.is_edited,'N')='Y' OR a.status_id<>b.status_id
	   
-- Insert Process

    INSERT INTO dbo.adjustments (    
		 adjustment_date	
		,warehouse_id
		,adjustment_by
		,status_id
		,adjustment_remarks
		,adjustment_no
		,created_by
		,created_date
        )
    SELECT 
		 adjustment_date	
		,warehouse_id
		,adjustment_by
		,status_id
		,adjustment_remarks	
		 ,concat(dbo.getWarehouseCode(@warehouse_id),'-',cast(Year(getDate()) as varchar(20)),'-',dbo.getWarehouseAdjNo(@warehouse_id))	
	   ,@user_id
	   ,GETDATE()
    FROM @tt
    WHERE adjustment_id IS NULL
	AND @warehouse_id IS NOT NULL

	SELECT @id = adjustment_id, @statusId=dbo.getPageProcessActionIdByStatusId(status_id,1133) FROM @tt;
	IF ISNULL(@id,0) = 0
	BEGIN
	   SELECT @id=doc_id FROM doc_routings WHERE doc_routing_id = @@IDENTITY;
	   EXEC dbo.doc_routing_process_upd 1133,@id,@statusId,@user_id;
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

	IF (SELECT COUNT(*) FROM dbo.adjustment_details WHERE adjustment_id=@id) > 0
	    EXEC dbo.doc_routing_process_upd 1133,@id,@statusId,@user_id;
END





