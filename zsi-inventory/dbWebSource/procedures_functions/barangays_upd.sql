
CREATE PROCEDURE [dbo].[barangays_upd]
(
    @tt barangays_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 	   	     
			barangay_code			= b.barangay_code
			,barangay_name			= b.barangay_name
			,barangay_sname			= b.barangay_sname
			,state_id				= b.state_id

       FROM dbo.barangays a INNER JOIN @tt b
	     ON a.barangay_id = b.barangay_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO barangays(         
		 barangay_code				 
		,barangay_name			 
		,barangay_sname
		,state_id
    )
	SELECT          
		 barangay_code				 
		,barangay_name			 
		,barangay_sname
		,state_id

	FROM @tt 

	WHERE barangay_id IS NULL
	AND barangay_code IS NOT NULL
	AND barangay_name IS NOT NULL




