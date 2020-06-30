
CREATE PROCEDURE [dbo].[devices_upd]
(
    @tt    devices_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	     mac_address			= b.mac_address	
			,company_code			= b.company_code
			,serial_no				= b.serial_no
			,device_desc			= b.device_desc
			,is_active				= b.is_active		
	   	    ,updated_by				= @user_id
			,updated_date			= GETDATE()

       FROM dbo.devices a INNER JOIN @tt b
	     ON a.device_id = b.device_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
			and b.mac_address IS NOT NULL
	        and b.company_code IS NOT NULL
	        and b.serial_no IS NOT NULL
		);
-- Insert Process
	INSERT INTO devices(
         mac_address		 
		,company_code	 
		,serial_no		 
		,device_desc	 
		,is_active		 
		,created_by
		,created_date
    )
	SELECT 
		 mac_address	
		,company_code	
		,serial_no		
		,device_desc	
		,is_active		
	   ,@user_id
	   , GETDATE()
	FROM @tt 
	WHERE device_id IS NULL
	and mac_address IS NOT NULL
	and company_code IS NOT NULL
	and serial_no IS NOT NULL
 




