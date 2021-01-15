

CREATE PROCEDURE [dbo].[dd_devices_sel]
( 
    @user_id INT = NULL
)
AS
BEGIN
	SELECT device_id, serial_no, tag_no FROM dbo.devices WHERE is_active='Y' ; 

 END;

