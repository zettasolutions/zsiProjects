
CREATE PROCEDURE [dbo].[employees_upd]
(
    @tt    employees_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET id_number		=	b.id_number
			,last_name		=	b.last_name
			,first_name		=	b.first_name
			,middle_name	=	b.middle_name
			,name_suffix	=	b.name_suffix
			,civil_status	=	b.civil_status
			,contact_number	=	b.contact_number
			,email			=	b.email
			,gender			=	b.gender
			,wing_id		=	b.wing_id
			,squadron_id	=	b.squadron_id
			,rank_id		=	b.rank_id
			,is_active		=	b.is_active
			,updated_by		=	@user_id
            ,updated_date   =	GETDATE()
		FROM dbo.employees a INNER JOIN @tt b
        ON a.employee_id = b.employee_id 
		WHERE (
				isnull(a.id_number,'')		 <> isnull(b.id_number,'')   
		    OR	isnull(a.last_name,'')		 <> isnull(b.last_name,'')   
			OR	isnull(a.first_name,'')		 <> isnull(b.first_name,'')  		    
			OR	isnull(a.middle_name,'')	 <> isnull(b.middle_name,'')   
			OR	isnull(a.name_suffix,'')	 <> isnull(b.name_suffix,'')  		    
			OR	isnull(a.civil_status,'')	 <> isnull(b.civil_status,'')   
			OR	isnull(a.contact_number,'')	 <> isnull(b.contact_number,'')  		    
			OR	isnull(a.email,'')			 <> isnull(b.email	,'')   
			OR	isnull(a.gender,'')			 <> isnull(b.gender,'')  		    
			OR	isnull(a.wing_id,0)			 <> isnull(b.wing_id,0)   
			OR	isnull(a.squadron_id,0)		 <> isnull(b.squadron_id,0)   
		    OR	isnull(a.rank_id,0)		     <> isnull(b.rank_id,0)   
			OR	isnull(a.is_active,'')		 <> isnull(b.is_active,'')  	 
			  )

-- Insert Process

    INSERT INTO employees(
		id_number			
		,last_name		
		,first_name		
		,middle_name	
		,name_suffix	
		,civil_status	
		,contact_number
		,email		
		,gender			
		,wing_id		
		,squadron_id	
		,rank_id		
		,is_active		
		,created_by
        ,created_date	
        )
    SELECT 
		id_number			
		,last_name		
		,first_name		
		,middle_name	
		,name_suffix	
		,civil_status	
		,contact_number	
		,email		
		,gender			
		,wing_id		
		,squadron_id	
		,rank_id		
		,is_active		
		,@user_id  
		,GETDATE()
    FROM @tt
    WHERE employee_id IS NULL 
	AND id_number IS NOT NULL
	AND last_name IS NOT NULL
	AND first_name IS NOT NULL;
END
