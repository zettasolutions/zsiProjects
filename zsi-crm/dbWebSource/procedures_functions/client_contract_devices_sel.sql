


CREATE PROCEDURE [dbo].[client_contract_devices_sel]  
(  
    @user_id int = NULL
   --,@is_active varchar(1)='Y'
)  
AS  
BEGIN  

SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.client_contract_devices WHERE 1=1';

	--IF @is_active <> ''
	--	SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';


	exec(@stmt);
 
END;  


