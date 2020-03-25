CREATE PROCEDURE [dbo].[classes_upd]
(
    @tt classes_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 	   	     
			 class_code				= b.class_code
			,class_name				= b.class_name
			,class_desc				= b.class_desc
			,created_by				= @user_id
			,created_date			= GETDATE()
	   	    ,updated_by				= @user_id
			,updated_date			= GETDATE()

       FROM dbo.classes a INNER JOIN @tt b
	     ON a.class_id = b.class_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO classes(         
		 class_code				 
		,class_name			 
		,class_desc
		,created_by		 
		,created_date				 					 
		,updated_by
		,updated_date
    )
	SELECT          
		 class_code				 
		,class_name			 
		,class_desc	 
		,@user_id
		,GETDATE()						 		
	    ,@user_id
	    ,GETDATE()
	FROM @tt 

	WHERE class_id IS NULL
	AND class_code IS NOT NULL
	AND class_name IS NOT NULL






