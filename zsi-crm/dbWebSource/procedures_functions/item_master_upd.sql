


CREATE PROCEDURE [dbo].[item_master_upd]
(
    @tt item_master_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 	   	     
			 item_code				= b.item_code
			,item_name				= b.item_name
			,item_desc				= b.item_desc
			,item_category_id		= b.item_category_id
			,item_class_id			= b.item_class_id
			,item_type_id			= b.item_type_id
			,is_active				= b.is_active 
			,created_by				= @user_id
			,created_date			= DATEADD(HOUR, 8, GETUTCDATE())
	   	    ,updated_by				= @user_id
			,updated_date			= DATEADD(HOUR, 8, GETUTCDATE())

       FROM dbo.item_master a INNER JOIN @tt b
	     ON a.item_id = b.item_id
	     
-- Insert Process
	INSERT INTO item_master (         
			item_code					 
			,item_name				 
			,item_desc			 
			,item_category_id				 
			,item_class_id				 
			,item_type_id				 
			,is_active	 		 
			,created_by		 
			,created_date				 					 
			,updated_by
			,updated_date
    )
	SELECT          
			item_code					 
			,item_name				 
			,item_desc			 
			,item_category_id				 
			,item_class_id				 
			,item_type_id				 
			,is_active	 		 
			,@user_id
			,DATEADD(HOUR, 8, GETUTCDATE())					 		
			,@user_id
			,DATEADD(HOUR, 8, GETUTCDATE())

	FROM @tt 

	WHERE item_id IS NULL
	AND item_code IS NOT NULL
	AND item_name IS NOT NULL




