
CREATE PROCEDURE [dbo].[states_upd]
(
    @tt states_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 	   	     
			state_code			= b.state_code
			,state_name			= b.state_name
			,state_sname		= b.state_sname
			,country_id			= b.country_id

       FROM dbo.states a INNER JOIN @tt b
	     ON a.state_id = b.state_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO states(         
		 state_code				 
		,state_name			 
		,state_sname
		,country_id
    )
	SELECT          
		 state_code				 
		,state_name			 
		,state_sname
		,country_id

	FROM @tt 

	WHERE state_id IS NULL
	AND state_code IS NOT NULL
	AND state_name IS NOT NULL
	






