


CREATE PROCEDURE [dbo].[monitoring_types_upd]
(
    @tt    monitoring_types_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  monitoring_type_code	= b.monitoring_type_code
		,monitoring_type_name	= b.monitoring_type_name
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.monitoring_types a INNER JOIN @tt b
    ON a.monitoring_type_id = b.monitoring_type_id
    WHERE (
			isnull(a.monitoring_type_code,'')		<> isnull(b.monitoring_type_code,'')  
		OR	isnull(a.monitoring_type_name,'')		<> isnull(b.monitoring_type_name,'')  
		OR	isnull(a.is_active,'')					<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.monitoring_types (
         monitoring_type_code 
		,monitoring_type_name
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        monitoring_type_code 
	   ,monitoring_type_name	
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE monitoring_type_id IS NULL;
END

