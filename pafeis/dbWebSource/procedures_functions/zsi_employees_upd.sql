
CREATE PROCEDURE [dbo].[zsi_employees_upd]
(
    @tt    zsi_employees_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET 
			 first_name				  = b.first_name
			,middle_name			  = b.middle_name
			,last_name				  = b.last_name
			,name_suffix			  = b.name_suffix
			,birth_date				  = b.birth_date
			,gender					  = b.gender
			,marital_status			  = b.marital_status
			,user_id				  = b.user_id
			,position_id			  = b.position_id
			,present_address		  = b.present_address
			,provincial_address		  = b.provincial_address
			,contact_no				  = b.contact_no
			,email_address			  = b.email_address
			,emergency_contact_person = b.emergency_contact_person
			,emergency_contact_no	  = b.emergency_contact_no
			,is_active				  = b.is_active
            ,updated_by				  = @user_id
            ,updated_date			  = GETDATE()
     FROM dbo.zsi_employees a INNER JOIN @tt b
        ON a.employee_id = b.employee_id 
       WHERE (
				
				isnull(a.first_name,'')					 <> isnull(b.first_name,'')   
			OR	isnull(a.middle_name,'')				 <> isnull(b.middle_name,'')   
			OR	isnull(a.last_name,'')					 <> isnull(b.last_name,'')   
			OR	isnull(a.name_suffix,'')				 <> isnull(b.name_suffix,'')   
			OR	isnull(a.birth_date,'')					 <> isnull(b.birth_date,'')   
			OR	isnull(a.gender,'')						 <> isnull(b.gender,'')   
			OR	isnull(a.marital_status,'')				 <> isnull(b.marital_status,'')
			OR	isnull(a.user_id,'')					 <> isnull(b.user_id,'')
			OR	isnull(a.position_id,0)					 <> isnull(b.position_id,0)   
			OR	isnull(a.present_address,'')			 <> isnull(b.present_address,'')   
			OR	isnull(a.contact_no,'')					 <> isnull(b.contact_no,'')   
			OR	isnull(a.email_address,'')				 <> isnull(b.email_address,'')   
			OR	isnull(a.emergency_contact_person,'')	 <> isnull(b.emergency_contact_person,'')   
			OR	isnull(a.emergency_contact_no,'')		 <> isnull(b.emergency_contact_no,'')   
			OR	isnull(a.is_active,'')					 <> isnull(b.is_active,'')
	   )
	  
-- Insert Process

    INSERT INTO zsi_employees (
       
		 first_name	
		,middle_name	
		,last_name		
		,name_suffix		
		,birth_date			
		,gender	
		,marital_status
		,user_id
		,position_id	
		,present_address	
		,contact_no		
		,email_address		
		,emergency_contact_person			
		,emergency_contact_no	
		,is_active	
		,created_by
        ,created_date
        )

    SELECT 
       
		 first_name	
		,middle_name	
		,last_name		
		,name_suffix		
		,birth_date			
		,gender	
		,marital_status
		,user_id
		,position_id	
		,present_address	
		,contact_no		
		,email_address		
		,emergency_contact_person			
		,emergency_contact_no	
		,is_active	
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE employee_id IS NULL
END





