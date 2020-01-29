
CREATE PROCEDURE [dbo].[departments_upd]
(
    @tt    departments_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	      department_code	= b.department_code
			 ,department_name	= b.department_name	   
			 ,is_active         = b.is_active
       FROM dbo.departments a INNER JOIN @tt b
	     ON a.department_id = b.department_id 
	   WHERE (
			isnull(b.is_edited,'')  <> ''
		);

-- Insert Process
	INSERT INTO departments (
         department_code
		,department_name	
		,is_active
		,created_by
		,created_date
    )
	SELECT 
         department_code
		,department_name	
		,is_active
		,@user_id
		,GETDATE()	
	FROM @tt 
	WHERE  department_id IS NULL
	  AND department_code IS NOT NULL
	  AND department_name IS NOT NULL

