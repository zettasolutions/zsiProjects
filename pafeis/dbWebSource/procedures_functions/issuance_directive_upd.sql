-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 10, 2016 6:10 PM
-- Description:	Issuance directive insert and update records.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================

CREATE PROCEDURE [dbo].[issuance_directive_upd]
(
    @tt    issuance_directive_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  issuance_directive_no		= b.issuance_directive_no
		,issued_directive_from_id	= b.issued_directive_from_id
		,issued_directive_to_id		= b.issued_directive_to_id
		,attached_filename			= b.attached_filename
		,process_id					= b.process_id
		,action_id					= b.action_id
        ,updated_by					= @user_id
        ,updated_date				= GETDATE()
    FROM dbo.issuance_directive a INNER JOIN @tt b
    ON a.issuance_directive_id = b.issuance_directive_id
    WHERE (
			isnull(a.issuance_directive_no,'')		<> isnull(b.issuance_directive_no,'')  
		OR	isnull(a.issued_directive_from_id,0)	<> isnull(b.issued_directive_from_id,0)  
		OR	isnull(a.issued_directive_to_id,0)		<> isnull(b.issued_directive_to_id,0)  
		OR	isnull(a.attached_filename,'')			<> isnull(b.attached_filename,'') 
		OR	isnull(a.process_id,0)					<> isnull(b.process_id,0)  
		OR	isnull(a.action_id,0)					<> isnull(b.action_id,0)  
	)
	   
-- Insert Process
    INSERT INTO dbo.issuance_directive (
         issuance_directive_no 
		,issued_directive_from_id
		,issued_directive_to_id
		,attached_filename
		,process_id
		,action_id
        ,created_by
        ,created_date
        )
    SELECT 
        issuance_directive_no 
	   ,issued_directive_from_id
	   ,issued_directive_to_id	
	   ,attached_filename
	   ,process_id
	   ,action_id
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE issuance_directive_id IS NULL;
END


