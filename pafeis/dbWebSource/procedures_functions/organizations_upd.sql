

CREATE PROCEDURE [dbo].[organizations_upd]
(
    @tt    organizations_tt READONLY
   ,@user_id int
)
AS

BEGIN
   SET NOCOUNT ON
-- Update Process
    UPDATE a 
    SET  organization_code  	= b.organization_code 
		,organization_name		= b.organization_name	
		,organization_pid		= b.organization_pid
		,organization_group_id  = b.organization_group_id
		,organization_type_id	= b.organization_type_id
		,organization_head_id	= b.organization_head_id
		,organization_address   = b.organization_address
		,squadron_type_id       = b.squadron_type_id
		,is_active		        = b.is_active
        ,updated_by		        = @user_id
        ,updated_date	        = GETDATE()
    FROM dbo.organizations a INNER JOIN @tt b
    ON a.organization_id = b.organization_id
    WHERE ISNULL(b.is_edited,'N')='Y'
	/*
	(
			isnull(a.organization_code,'')	<> isnull(b.organization_code,'')  
		OR	isnull(a.organization_name,'')	<> isnull(b.organization_name,'') 
		OR	isnull(a.organization_pid,0)	<> isnull(b.organization_pid,0) 
		OR	isnull(a.organization_type_id,0)<> isnull(b.organization_type_id,0) 
		OR	isnull(a.organization_head_id,0)<> isnull(b.organization_head_id,0) 
		OR	isnull(a.organization_address,'')	<> isnull(b.organization_address,'') 
		OR	isnull(a.is_active,'')	<> isnull(b.is_active,'')  
	)
	*/   
-- Insert Process
    INSERT INTO dbo.organizations (
         organization_code 
		,organization_name	
		,organization_pid
		,organization_group_id
		,organization_type_id
		,organization_head_id
		,organization_address
		,squadron_type_id
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        organization_code 
	   ,organization_name	
	   ,organization_pid
	   ,organization_group_id
	   ,organization_type_id
	   ,organization_head_id
	   ,organization_address
	   ,squadron_type_id
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE organization_id IS NULL
	  AND organization_code IS NOT NULL
	  AND organization_type_id IS NOT NULL;
END






