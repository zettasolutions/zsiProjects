

CREATE PROCEDURE [dbo].[image_drivers_image_licence_upd](
       @user_id INT
      ,@driver_licence_img_filename NVARCHAR(200)

)
AS
BEGIN
SET NOCOUNT ON
update dbo.users
set driver_licence_img_filename =@driver_licence_img_filename 
   where user_id = @user_id

END 