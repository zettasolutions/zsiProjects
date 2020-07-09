

CREATE PROCEDURE [dbo].[devices_sel]  
(  
    @user_id int = NULL
   ,@batch_id int = null
   ,@is_active varchar(1)='Y'
)  
AS  
BEGIN  

SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.devices WHERE 1=1';

	IF @is_active <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + ''''; 
	IF @batch_id <> '' 
		   SET @stmt = @stmt + ' AND batch_id=' + CAST(@batch_id AS VARCHAR);
	exec(@stmt);
 
END;  

