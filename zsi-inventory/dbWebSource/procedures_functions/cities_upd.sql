
CREATE PROCEDURE [dbo].[cities_upd]
(
    @tt cities_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 	   	     
			city_code			= b.city_code
			,city_name			= b.city_name
			,city_sname			= b.city_sname
			,state_id			= b.state_id

       FROM dbo.cities a INNER JOIN @tt b
	     ON a.city_id = b.city_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO cities(         
		 city_code				 
		,city_name			 
		,city_sname
		,state_id
    )
	SELECT          
		 city_code				 
		,city_name			 
		,city_sname
		,state_id

	FROM @tt 

	WHERE city_id IS NULL
	AND city_code IS NOT NULL
	AND city_name IS NOT NULL
	






