CREATE PROCEDURE [dbo].[employee_images_test_sel] 
(
	@user_id				INT 
)
as
	

begin
      --SELECT  image_id, CONVERT(varchar(max), file_content,1) as [file_content] FROM dbo.employee_images;
	SELECT * FROM dbo.employee_images;

end

