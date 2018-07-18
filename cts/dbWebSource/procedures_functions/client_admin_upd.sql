

CREATE PROCEDURE [dbo].[client_admin_upd]
(
    @tt    users_tt READONLY
   ,@user_id INT=NULL
)
AS

BEGIN
   SET NOCOUNT ON
-- Insert Process

    INSERT INTO users(
	     client_id
		,last_name		
		,first_name		
		,middle_name	
		,name_suffix	
		,email_add
		,landline_no	
		,mobile_no1     
		,mobile_no2       
		,logon		
		,password	
		,is_developer	
		,is_add		
		,is_admin	
     	,is_active
        )
    SELECT 
		 client_id			
		,upper(last_name)	
		,upper(first_name)	
		,upper(middle_name)	
		,upper(name_suffix)
		,email_add	
		,landline_no	
		,mobile_no1     
		,mobile_no2     	    
		--,dbo.createUserLogon(client_id, concat(SUBSTRING(first_name,1,1),last_name))	
		,logon	
		,password		
		,is_developer
		,'Y'	
		,'Y'		
		,'Y'
    FROM @tt
    WHERE app_user_id IS NULL 
	AND client_id IS NOT NULL
	AND last_name IS NOT NULL
	AND first_name IS NOT NULL;
END

--SELECT * FROM clients
--SELECT * FROM users

--TRUNCATE TABLE clients
--DELETE users WHERE user_id=100



