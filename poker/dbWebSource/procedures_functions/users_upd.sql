


CREATE PROCEDURE [dbo].[users_upd]
(
    @tt    users_tt READONLY
   ,@user_id int
)
AS

BEGIN
   SET NOCOUNT ON
-- Update Process
    UPDATE a 
        SET  last_name		=	upper(b.last_name)
			,first_name		=	upper(b.first_name)
			,middle_name	=	upper(b.middle_name)
			,name_suffix	=	upper(b.name_suffix)
			,landline_no	=	b.landline_no
			,mobile_no1     =   b.mobile_no1
			,mobile_no2     =   b.mobile_no2
			,email_add		=	b.email_add
			,is_developer   =	b.is_developer
			,is_add			=	b.is_add
			,is_admin		=	b.is_admin
			,is_active      =   b.is_active
			,updated_by		=	@user_id
            ,updated_date   =	GETDATE()
		FROM dbo.users a INNER JOIN @tt b
        ON a.user_id = b.app_user_id 
		WHERE isnull(b.is_edited,'N')='Y'

-- Insert Process

    INSERT INTO users(
		last_name		
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
		,created_by
        ,created_date	
        )
    SELECT 
		 upper(last_name)	
		,upper(first_name)	
		,upper(middle_name)	
		,upper(name_suffix)
		,email_add	
		,landline_no	
		,mobile_no1     
		,mobile_no2     	    
		,dbo.createUserLogon(concat(SUBSTRING(first_name,1,1),last_name))		
		,'welcome'		
		,is_developer
		,is_add	
		,is_admin		
		,is_active
		,@user_id  
		,GETDATE()
    FROM @tt
    WHERE app_user_id IS NULL 
	AND last_name IS NOT NULL
	AND first_name IS NOT NULL;
END
