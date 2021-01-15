

CREATE PROCEDURE [dbo].[dd_device_brands_sel]
( 
    @user_id INT = NULL
)
AS
BEGIN
	SELECT device_brand_id, device_brand_name FROM dbo.device_brands WHERE is_active='Y' ; 

 END;

