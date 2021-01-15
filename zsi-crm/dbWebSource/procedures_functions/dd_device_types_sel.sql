
CREATE PROCEDURE [dbo].[dd_device_types_sel]
( 
    @user_id INT = NULL
)
AS
BEGIN
	SELECT device_type_id, device_type FROM dbo.device_types WHERE is_active='Y' ; 

 END;
