
CREATE PROCEDURE [dbo].[image_driver_pao_upd](
       @user_id INT
      ,@img_filename NVARCHAR(200)

)
AS
BEGIN
SET NOCOUNT ON
update dbo.users
set img_filename =@img_filename 
   where user_id = @user_id

END 