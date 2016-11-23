

CREATE PROCEDURE [dbo].[issuances_upd]
(
    @tt    issuances_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  issuance_no		= b.issuance_no		
		,organization_id	= b.organization_id		
		,issued_by		    = b.issued_by
		,issued_date        = b.issued_date
		,issuance_directive_id = b.issuance_directive_id
		,aircraft_id		= b.aircraft_id
		,status_id			= b.status_id
		,status_remarks     = b.status_remarks
		,authority_ref		= b.authority_ref
		,updated_by			= @user_id
        ,updated_date		= GETDATE()
    FROM dbo.issuances a INNER JOIN @tt b
    ON a.issuance_id = b.issuance_id
    WHERE (
			isnull(a.issuance_no,'')			<> isnull(b.issuance_no,'')  
		OR	isnull(a.organization_id,0)			<> isnull(b.organization_id,0)  		
		OR	isnull(a.issued_by,0)				<> isnull(b.issued_by,0) 
		OR	isnull(a.issued_date,'')			<> isnull(b.issued_date,'') 
		OR	isnull(a.issuance_directive_id,0)	<> isnull(b.issuance_directive_id,0) 
		OR	isnull(a.aircraft_id,0)				<> isnull(b.aircraft_id,0) 
		OR	isnull(a.status_id,0)				<> isnull(b.status_id,0) 
		OR	isnull(a.status_remarks,'')			<> isnull(b.status_remarks,'') 
		OR	isnull(a.authority_ref,'')			<> isnull(b.authority_ref,'') 
	)
	   
-- Insert Process
    INSERT INTO dbo.issuances (
         issuance_no 
		,organization_id		
		,issued_by
		,issued_date
		,issuance_directive_id
		,aircraft_id
		,status_id
		,status_remarks
		,authority_ref
		,created_by
		,created_date
        )
    SELECT 
        issuance_no 
	   ,organization_id		
	   ,issued_by
	   ,issued_date
	   ,issuance_directive_id
	   ,aircraft_id
	   ,status_id
	   ,status_remarks
	   ,authority_ref
	   ,@user_id
	   ,GETDATE()
    FROM @tt
    WHERE issuance_id IS NULL
	  AND organization_id IS NOT NULL;

	RETURN @@identity;
END



