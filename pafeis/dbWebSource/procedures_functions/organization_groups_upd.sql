CREATE PROCEDURE [dbo].[organization_groups_upd]
(
    @tt    organization_groups_tt READONLY
   ,@user_id int
)
AS

BEGIN
   SET NOCOUNT ON
-- Update Process
    UPDATE a 
    SET  organization_group_code  	= b.organization_group_code 
		,organization_group_name		= b.organization_group_name	
		,seq_no		= b.seq_no
		,is_active		= b.is_active
        ,updated_by		= @user_id
        ,updated_date	= GETDATE()
    FROM dbo.organization_groups a INNER JOIN @tt b
    ON a.organization_group_id = b.organization_group_id
    WHERE (
			isnull(a.organization_group_code,'')	<> isnull(b.organization_group_code,'')  
		OR	isnull(a.organization_group_name,'')	<> isnull(b.organization_group_name,'') 
		OR	isnull(a.seq_no,0)	<> isnull(b.seq_no,0) 
		OR	isnull(a.is_active,'')	<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.organization_groups (
         organization_group_code 
		,organization_group_name	
		,seq_no
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        organization_group_code 
	   ,organization_group_name	
	   ,seq_no
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE organization_group_id IS NULL
	  AND organization_group_code IS NOT NULL;
END


