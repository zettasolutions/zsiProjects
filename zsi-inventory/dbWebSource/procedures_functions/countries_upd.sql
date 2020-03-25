
CREATE PROCEDURE [dbo].[countries_upd]
(
    @tt countries_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 	   	     
			country_code			= b.country_code
			,country_name			= b.country_name
			,country_sname			= b.country_sname

       FROM dbo.countries a INNER JOIN @tt b
	     ON a.country_id = b.country_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO countries(         
		 country_code				 
		,country_name			 
		,country_sname
		
    )
	SELECT          
		 country_code				 
		,country_name			 
		,country_sname

	FROM @tt 

	WHERE country_id IS NULL
	AND country_code IS NOT NULL
	AND country_name IS NOT NULL
	






