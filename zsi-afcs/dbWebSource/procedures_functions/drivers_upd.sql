

CREATE PROCEDURE [dbo].[drivers_upd]
(
    @tt    drivers_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET
			 last_name						= b.last_name 
			,middle_name					= b.middle_name
			,name_suffix					= b.name_suffix
			,driver_academy_no				= b.driver_academy_no
			,driver_license_no				= b.driver_license_no
			,driver_license_exp_date		= DATEADD(HOUR, 8, GETUTCDATE())
			,position_id					= b.position_id	 
			,is_active						= b.is_active		
	   	    
       FROM zsi_hcm.dbo.employees a INNER JOIN @tt b
	     ON a.id = b.user_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
