  
CREATE PROCEDURE [dbo].[zfleet_test_filename_upd](  
       @id INT  
      ,@file_name VARCHAR(200)  
  
)  
AS  
BEGIN  
SET NOCOUNT ON  
update dbo.zfleet_test_form  
set file_name=@file_name  
   where id = @id  
  
END 