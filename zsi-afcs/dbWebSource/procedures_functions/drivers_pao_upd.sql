
CREATE PROCEDURE [dbo].[drivers_pao_upd]
(
    @tt    drivers_pao_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET
			 first_name			= b.first_name	
	   	    ,last_name			= b.last_name	 
			,hash_key			= b.hash_key 
			,is_active			= b.is_active		
	   	     
       FROM dbo.drivers_active_v a INNER JOIN @tt b
	     ON a.user_id = b.user_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO users(
		 first_name
		,last_name  
		,hash_key 
		,is_active 
    )
	SELECT 
		 first_name
		,last_name  
		,newid() 
		,is_active	 
	FROM @tt 
	WHERE user_id IS NULL
	AND ISNULL(first_name,'') <>''
	AND ISNULL(last_name,'') <>'' 

