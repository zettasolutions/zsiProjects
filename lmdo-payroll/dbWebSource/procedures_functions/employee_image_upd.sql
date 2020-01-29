
CREATE PROCEDURE [dbo].[employee_image_upd](
       @employee_id INT
      ,@img_filename VARCHAR(200)

)
AS
BEGIN
SET NOCOUNT ON
update dbo.employees
set img_filename=@img_filename
   where employee_id = @employee_id

END 