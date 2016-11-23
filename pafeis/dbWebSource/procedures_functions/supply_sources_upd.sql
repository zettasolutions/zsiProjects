
CREATE PROCEDURE [dbo].[supply_sources_upd]
(
    @tt    supply_sources_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  supply_source_name		= b.supply_source_name
		,full_address			= b.full_address
		,contact_no  			= b.contact_no
		,email_address  		= b.email_address
		,contact_person		    = b.contact_person
		,is_local				= b.is_local
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.supply_sources a INNER JOIN @tt b
    ON a.supply_source_id = b.supply_source_id
    WHERE (
			isnull(a.supply_source_name,'')			<> isnull(b.supply_source_name,'')  
		OR	isnull(a.full_address,'')		<> isnull(b.full_address,'')  
		OR	isnull(a.contact_no,'')		<> isnull(b.contact_no,'')   
		OR	isnull(a.email_address,'')	<> isnull(b.email_address,'')   
		OR	isnull(a.contact_person,'')		<> isnull(b.contact_person,'')  
		OR	isnull(a.is_local,'')			<> isnull(b.is_local,'') 
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.supply_sources (
         supply_source_name 
		,full_address
		,contact_no
		,email_address
		,contact_person
		,is_local
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        supply_source_name 
	   ,full_address	
	   ,contact_no
	   ,email_address
	   ,contact_person
	   ,is_local
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE supply_source_id IS NULL
	  AND supply_source_name IS NOT NULL;
END



