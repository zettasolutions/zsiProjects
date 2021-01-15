

CREATE PROCEDURE [dbo].[employee_image_file_upd](
   @user_id		INT = NULL
  ,@tmp_file_id	INT 
)
AS
BEGIN
  DECLARE @file_name		nvarchar(50) = NULL  
  DECLARE @file_content     varbinary(max) = NULL        

  PRINT(@file_content);
  PRINT(@file_name);
	SET NOCOUNT ON 
	
	SELECT  @file_name = file_name FROM zsi_afcs.dbo.tmp_files WHERE tmp_file_id=@tmp_file_id
	SELECT  @file_content = file_content FROM zsi_afcs.dbo.tmp_files WHERE tmp_file_id=@tmp_file_id
	  
	DECLARE @stmt		VARCHAR(4000);
	DECLARE @client_id  INT;
	SELECT @client_id=company_id FROM dbo.users_v where user_id = @user_id;

	INSERT INTO dbo.employee_images  
		 (  
		   id
		  ,file_name  
		  ,file_content  
		 )   
		 VALUES(
		   @user_id
		  ,@file_name
		  ,@file_content
		) 

	 -- DELETE FROM zsi_afcs.dbo.tmp_files WHERE tmp_file_id=@tmp_file_id
	  --SET @stmt = CONCAT('UPDATE dbo.employees_',@client_id,' SET  img_filename = ''',CONVERT(varchar(max),@file_content,2),'''  WHERE id = ',@user_id,'')

END 

--exec employee_image_file_upd @id=2,@tmp_file_id=3

 
