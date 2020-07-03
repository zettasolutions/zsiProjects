


CREATE PROCEDURE [dbo].[client_contract_devices_sel]  
(  
    @user_id int = NULL
   ,@client_contract_id nvarchar(20) = NULL
)   
AS  
BEGIN  

SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.client_contract_devices WHERE 1=1';

	IF ISNULL(@client_contract_id,0)<>0
       set @stmt = @stmt + ' AND client_contract_id='''+ @client_contract_id+'''';


	exec(@stmt);
 
END;  


