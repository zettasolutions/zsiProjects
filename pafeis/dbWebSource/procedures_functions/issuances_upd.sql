
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
		,authority_id		= b.authority_id
		,issued_to_id		= b.issued_to_id
		,issuance_directive_id = b.issuance_directive_id
		,issued_by		    = b.issued_by
		,issued_date        = b.issued_date
		,page_process_action_id  = b.page_process_action_id
		,remarks            = b.remarks
		,updated_by			= @user_id
        ,updated_date		= GETDATE()
    FROM dbo.issuances a INNER JOIN @tt b
    ON a.issuance_id = b.issuance_id
    WHERE (
			isnull(a.issuance_no,'')		  <> isnull(b.issuance_no,'')  
		OR	isnull(a.authority_id,0)		  <> isnull(b.authority_id,0)  
		OR	isnull(a.issued_to_id,0)		  <> isnull(b.issued_to_id,0) 
		OR	isnull(a.issuance_directive_id,0) <> isnull(b.issuance_directive_id,0) 
		OR	isnull(a.issued_by,0)		      <> isnull(b.issued_by,0) 
		OR	isnull(a.issued_date,'')	      <> isnull(b.issued_date,'') 
		OR	isnull(a.page_process_action_id,0)<> isnull(b.page_process_action_id,0) 
		OR	isnull(a.remarks,'')		      <> isnull(b.remarks,'') 
	)
	   
-- Insert Process
    INSERT INTO dbo.issuances (
         issuance_no 
		,authority_id
		,issued_to_id
		,issuance_directive_id
		,issued_by
		,issued_date
		,page_process_action_id
		,remarks
		,created_by
		,created_date
        )
    SELECT 
        issuance_no 
	   ,authority_id
	   ,issued_to_id	
	   ,issuance_directive_id
	   ,issued_by
	   ,issued_date
	   ,page_process_action_id
	   ,remarks
	   ,@user_id
	   ,GETDATE()
    FROM @tt
    WHERE issuance_id IS NULL
	  AND authority_id IS NOT NULL;

	RETURN @@identity;
END


