
CREATE PROCEDURE [dbo].[employees_upd]
(
    @tt    employees_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET employee_name  = b.employee_name
			,position		= b.position
			,d_rate			= b.d_rate
			,area			= b.area
			,store_loc		= b.store_loc
			,is_active		= b.is_active
			,updated_by		= @user_id
            ,updated_date   = GETDATE()
     FROM dbo.employees a INNER JOIN @tt b
        ON a.emp_id = b.emp_id 
       WHERE (
				isnull(a.employee_name,'')			 <> isnull(b.employee_name,'')   
			OR	isnull(a.position,'')				 <> isnull(b.position,'')   
			OR	isnull(a.d_rate,0)					 <> isnull(b.d_rate,0) 
			OR	isnull(a.area,'')					 <> isnull(b.area,'') 
			OR	isnull(a.store_loc,'')				 <> isnull(b.store_loc,'')   
			OR	isnull(a.is_active,'')				 <> isnull(b.is_active,'')   
	   )

 

-- Insert Process

    INSERT INTO employees(
       
		 employee_name
		,position 
		,d_rate	  
		,area
        ,store_loc
		,is_active
		,created_by
        ,created_date
		
        )
    SELECT 
       
		 employee_name
		,position 
		,d_rate	  
		,area
        ,store_loc
		,is_active		
		,@user_id  
		,GETDATE()
       
       
    FROM @tt
    WHERE emp_id IS NULL
	 
END




