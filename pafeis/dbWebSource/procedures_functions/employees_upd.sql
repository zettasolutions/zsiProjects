
CREATE PROCEDURE [dbo].[employees_upd]
(
    @tt    employees_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET id_no		    =	b.id_no
			,last_name		=	b.last_name
			,first_name		=	b.first_name
			,middle_name	=	b.middle_name
			,name_suffix	=	b.name_suffix
			,civil_status	=	b.civil_status
			,contact_nos	=	b.contact_nos
			,email_add		=	b.email_add
			,gender			=	b.gender
			,organization_id=	b.organization_id
			,rank_id		=	b.rank_id
			,position_id	=	b.position_id
			,is_active      =   b.is_active
			,role_id        =   IIF(b.is_active='N',NULL,role_id)
			,updated_by		=	@user_id
            ,updated_date   =	GETDATE()
		FROM dbo.users a INNER JOIN @tt b
        ON a.user_id = b.user_id 
		WHERE (
				isnull(a.id_no,'')		     <> isnull(b.id_no,'')   
		    OR	isnull(a.last_name,'')		 <> isnull(b.last_name,'')   
			OR	isnull(a.first_name,'')		 <> isnull(b.first_name,'')  		    
			OR	isnull(a.middle_name,'')	 <> isnull(b.middle_name,'')   
			OR	isnull(a.name_suffix,'')	 <> isnull(b.name_suffix,'')  		    
			OR	isnull(a.civil_status,'')	 <> isnull(b.civil_status,'')   
			OR	isnull(a.contact_nos,'')	 <> isnull(b.contact_nos,'')  		    
			OR	isnull(a.email_add,'')	     <> isnull(b.email_add	,'')   
			OR	isnull(a.gender,'')			 <> isnull(b.gender,'')  		    
			OR	isnull(a.organization_id,0)	 <> isnull(b.organization_id,0)    
		    OR	isnull(a.rank_id,0)		     <> isnull(b.rank_id,0)   
			OR	isnull(a.position_id,0)		 <> isnull(b.position_id,0)
			OR	isnull(a.is_active,'')		 <> isnull(b.is_active,'')      
			  )

-- Insert Process

    INSERT INTO users(
		 id_no			
		,last_name		
		,first_name		
		,middle_name	
		,name_suffix	
		,civil_status	
		,contact_nos
		,email_add	
		,gender			
		,organization_id		
		,rank_id	
		,position_id	
		,is_active
		,created_by
        ,created_date	
        )
    SELECT 
		 id_no			
		,last_name		
		,first_name		
		,middle_name	
		,name_suffix	
		,civil_status	
		,contact_nos
		,email_add	
		,gender			
		,organization_id		
		,rank_id	
		,position_id	
		,is_active
		,@user_id  
		,GETDATE()
    FROM @tt
    WHERE user_id IS NULL 
	AND id_no IS NOT NULL
	AND last_name IS NOT NULL
	AND first_name IS NOT NULL;
END

