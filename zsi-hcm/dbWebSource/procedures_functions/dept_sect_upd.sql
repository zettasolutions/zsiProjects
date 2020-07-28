


CREATE PROCEDURE [dbo].[dept_sect_upd]
(
    @tt    dept_sect_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	       dept_sect_code		= b.dept_sect_code		
			  ,dept_sect_name		= b.dept_sect_name		
			  ,dept_sect_parent_id	= b.dept_sect_parent_id	
			  ,is_active			= b.is_active				
       FROM dbo.dept_sect a INNER JOIN @tt b
	     ON a.dept_sect_id = b.dept_sect_id 
	   WHERE (
			isnull(b.is_edited,'')  <> ''
		);

-- Insert Process
	INSERT INTO dept_sect (
         dept_sect_code		
		,dept_sect_name			
		,dept_sect_parent_id	
		,is_active				
		,created_by
		,created_date
    )
	SELECT 
         dept_sect_code		
		,dept_sect_name		
		,dept_sect_parent_id
		,is_active			
		,@user_id
		,GETDATE()	
	FROM @tt 
	WHERE  dept_sect_id IS NULL
	  AND dept_sect_code IS NOT NULL
	  AND dept_sect_name IS NOT NULL



