  
CREATE PROCEDURE [dbo].[image_file_employees_upd](  
       @employee_id INT  
      ,@img_filename VARCHAR(200)  
  
)  
AS  
BEGIN  
SET NOCOUNT ON  
update dbo.employees_0  
set img_filename=@img_filename  
   where id = @employee_id  
  
END 