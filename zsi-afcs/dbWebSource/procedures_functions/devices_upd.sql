
CREATE PROCEDURE [dbo].[devices_upd]
(
    @tt    devices_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
			 serial_no				= b.serial_no
			,device_desc			= b.device_desc
			,is_active				= b.is_active		
	   	    ,updated_by				= @user_id
			,updated_date			= GETDATE()

       FROM dbo.devices a INNER JOIN @tt b
	     ON a.device_id = b.device_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);


 




