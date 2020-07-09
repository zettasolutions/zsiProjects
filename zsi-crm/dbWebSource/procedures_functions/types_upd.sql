CREATE PROCEDURE [dbo].[types_upd]
(
    @tt types_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 	   	     
			type_code			= b.type_code
			,type_name			= b.type_name
			,type_desc			= b.type_desc
			,created_by				= @user_id
			,created_date			= DATEADD(HOUR, 8, GETUTCDATE())
	   	    ,updated_by				= @user_id
			,updated_date			= DATEADD(HOUR, 8, GETUTCDATE())

       FROM dbo.types a INNER JOIN @tt b
	     ON a.type_id = b.type_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO types(         
		 type_code				 
		,type_name			 
		,type_desc
		,created_by		 
		,created_date				 					 
		,updated_by
		,updated_date
    )
	SELECT          
		 type_code				 
		,type_name			 
		,type_desc	 
		,@user_id
		,DATEADD(HOUR, 8, GETUTCDATE())					 		
	    ,@user_id
	    ,DATEADD(HOUR, 8, GETUTCDATE())
	FROM @tt 

	WHERE type_id IS NULL
	AND type_code IS NOT NULL
	AND type_name IS NOT NULL





