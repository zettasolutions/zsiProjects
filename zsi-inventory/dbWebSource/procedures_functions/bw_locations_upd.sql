

CREATE PROCEDURE [dbo].[bw_locations_upd]
(
    @tt bw_locations_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 	   	     
			bw_code					= b.bw_code
			,bw_name				= b.bw_name
			,bw_address				= b.bw_address
			,barangay_id			= b.barangay_id
			,city_id				= b.city_id
			,state_id				= b.state_id
			,country_id				= b.country_id
			,is_branch				= b.is_branch
			,is_warehouse			= b.is_warehouse
			,created_by				= @user_id
			,created_date			= GETDATE()
	   	    ,updated_by				= @user_id
			,updated_date			= GETDATE()

       FROM dbo.bw_locations a INNER JOIN @tt b
	     ON a.bw_id = b.bw_id
	     
-- Insert Process
	INSERT INTO bw_locations (         
			bw_code					 
			,bw_name				 
			,bw_address				 
			,barangay_id			 
			,city_id				 
			,state_id				 
			,country_id				 
			,is_branch				 
			,is_warehouse			 
			,created_by		 
			,created_date				 					 
			,updated_by
			,updated_date
    )
	SELECT          
			bw_code					 
			,bw_name				 
			,bw_address				 
			,barangay_id			 
			,city_id				 
			,state_id				 
			,country_id				 
			,is_branch				 
			,is_warehouse			 
			,@user_id
			,GETDATE()						 		
			,@user_id
			,GETDATE()

	FROM @tt 

	WHERE bw_id IS NULL
	AND bw_code IS NOT NULL
	AND bw_name IS NOT NULL




