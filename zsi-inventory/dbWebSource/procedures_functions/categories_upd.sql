CREATE PROCEDURE [dbo].[categories_upd]
(
    @tt categories_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 	   	     
			category_code			= b.category_code
			,category_name			= b.category_name
			,category_desc			= b.category_desc
			,created_by				= @user_id
			,created_date			= GETDATE()
	   	    ,updated_by				= @user_id
			,updated_date			= GETDATE()

       FROM dbo.categories a INNER JOIN @tt b
	     ON a.category_id = b.category_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO categories(         
		 category_code				 
		,category_name			 
		,category_desc
		,created_by		 
		,created_date				 					 
		,updated_by
		,updated_date
    )
	SELECT          
		 category_code				 
		,category_name			 
		,category_desc	 
		,@user_id
		,GETDATE()						 		
	    ,@user_id
	    ,GETDATE()
	FROM @tt 

	WHERE category_id IS NULL
	AND category_code IS NOT NULL
	AND category_name IS NOT NULL





