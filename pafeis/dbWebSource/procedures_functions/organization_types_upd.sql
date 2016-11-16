

CREATE PROCEDURE [dbo].[organization_types_upd]
(
    @tt    organization_types_tt READONLY
   ,@user_id int
)
AS

BEGIN
   SET NOCOUNT ON
-- Update Process
    UPDATE a 
    SET  organization_type_code  	= b.organization_type_code 
		,organization_type_name		= b.organization_type_name	
		,level_no		= b.level_no
		,is_active		= b.is_active
        ,updated_by		= @user_id
        ,updated_date	= GETDATE()
    FROM dbo.organization_types a INNER JOIN @tt b
    ON a.organization_type_id = b.organization_type_id
    WHERE (
			isnull(a.organization_type_code,'')	<> isnull(b.organization_type_code,'')  
		OR	isnull(a.organization_type_name,'')	<> isnull(b.organization_type_name,'') 
		OR	isnull(a.level_no,0)	<> isnull(b.level_no,0) 
		OR	isnull(a.is_active,'')	<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.organization_types (
         organization_type_code 
		,organization_type_name	
		,level_no
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        organization_type_code 
	   ,organization_type_name	
	   ,level_no
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE organization_type_id IS NULL
	  AND organization_type_code IS NOT NULL;
END


