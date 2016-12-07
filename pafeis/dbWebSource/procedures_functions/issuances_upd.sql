

CREATE PROCEDURE [dbo].[issuances_upd]
(
    @tt    issuances_tt READONLY
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
    SET  organization_id	= b.organization_id		
		,issuance_no		= b.issuance_no		
		,issued_by		    = b.issued_by
		,issued_date        = b.issued_date
		,issuance_directive_id = b.issuance_directive_id
		,aircraft_id		= b.aircraft_id
		,transfer_organization_id		= b.transfer_organization_id
		,status_id			= b.status_id
		,status_remarks     = b.status_remarks
		,authority_ref		= b.authority_ref
		,updated_by			= @user_id
        ,updated_date		= GETDATE()
    FROM dbo.issuances a INNER JOIN @tt b
    ON a.issuance_id = b.issuance_id
    WHERE (
		isnull(a.organization_id,0)				<> isnull(b.organization_id,0)  		
		OR  isnull(a.issuance_no,'')			<> isnull(b.issuance_no,'')  
		OR	isnull(a.issued_by,0)				<> isnull(b.issued_by,0) 
		OR	isnull(a.issued_date,'')			<> isnull(b.issued_date,'') 
		OR	isnull(a.issuance_directive_id,0)	<> isnull(b.issuance_directive_id,0) 
		OR	isnull(a.aircraft_id,0)				<> isnull(b.aircraft_id,0) 
		OR	isnull(a.transfer_organization_id,0)				<> isnull(b.transfer_organization_id,0) 
		OR	isnull(a.status_id,0)				<> isnull(b.status_id,0) 
		OR	isnull(a.status_remarks,'')			<> isnull(b.status_remarks,'') 
		OR	isnull(a.authority_ref,'')			<> isnull(b.authority_ref,'') 
	)
	   
-- Insert Process
DECLARE @issuance_id INT;
SET @issuance_id = null;

    INSERT INTO dbo.issuances (
		organization_id		
		,issuance_no 
		,issued_by
		,issued_date
		,issuance_directive_id
		,aircraft_id
		,transfer_organization_id
		,status_id
		,status_remarks
		,authority_ref
		,created_by
		,created_date
        )
    SELECT 
	    dbo.getUserOrganizationId(@user_Id)	
	   ,issuance_no 
	   ,issued_by
	   ,issued_date
	   ,issuance_directive_id
	   ,aircraft_id
	   ,transfer_organization_id
	   ,status_id
	   ,status_remarks
	   ,authority_ref
	   ,@user_id
	   ,GETDATE()
    FROM @tt
    WHERE issuance_id IS NULL
	AND issuance_no IS NOT NULL
	AND (aircraft_id IS NOT NULL OR transfer_organization_id IS NOT NULL);


	SELECT @id = issuance_id, @statusId=status_id, @statusName=dbo.getStatusByPageProcessActionId(status_id) FROM @tt;
	IF ISNULL(@id,0) = 0
	BEGIN
		SELECT @id=doc_id FROM doc_routings WHERE doc_routing_id = @@IDENTITY;
		RETURN @id
	END;

	EXEC dbo.doc_routing_process_upd 66,@id,@statusId,@user_id;

	INSERT INTO @proc_tt SELECT proc_name FROM dbo.page_process_action_procs WHERE page_process_action_id=@statusId 
	SELECT @data_count =COUNT(*) FROM @proc_tt 
	WHILE @ctr < @data_count 
	BEGIN
	  SELECT TOP 1 @procName =proc_name FROM @proc_tt WHERE id> @ctr;
	  EXEC @procName @id
	  SET @ctr = @ctr + 1
	END
END



