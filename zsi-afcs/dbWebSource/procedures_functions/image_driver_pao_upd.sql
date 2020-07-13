
CREATE PROCEDURE [dbo].[image_driver_pao_upd](
       @user_id INT
      ,@img_filename NVARCHAR(200)

)
AS
BEGIN
SET NOCOUNT ON
update zsi_hcm.dbo.employees
set img_filename =@img_filename 
   where id = @user_id

END 