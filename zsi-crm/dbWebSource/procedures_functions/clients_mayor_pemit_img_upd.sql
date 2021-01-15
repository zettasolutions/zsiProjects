

CREATE procedure [dbo].[clients_mayor_pemit_img_upd](
    @client_id		INT = NULL
   ,@tmp_file_id		INT = NULL
)
AS
BEGIN
  DECLARE @file_name		nvarchar(50) = NULL  
  DECLARE @file_content     varbinary(max) = NULL        

	SET NOCOUNT ON 
	
	SELECT  @file_name = file_name FROM zsi_afcs.dbo.tmp_files WHERE tmp_file_id=@tmp_file_id
	SELECT  @file_content = file_content FROM zsi_afcs.dbo.tmp_files WHERE tmp_file_id=@tmp_file_id

	PRINT(@file_content);

	DECLARE @stmt		VARCHAR(4000);

	INSERT INTO dbo.client_images  
		 (  
		   client_id
		  ,mayor_permit_img
		 )   
		 VALUES(
		   @client_id
		  ,@file_content
		) 

	  DELETE FROM zsi_afcs.dbo.tmp_files WHERE tmp_file_id=@tmp_file_id

END 

--[dbo].[clients_mayor_pemit_img_upd] @user_id=2,@tmp_file_id=3