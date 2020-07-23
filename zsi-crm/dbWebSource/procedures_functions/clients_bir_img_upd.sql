

CREATE procedure [dbo].[clients_bir_img_upd](
   @client_id  int=null
  ,@user_id   int=null
  ,@bir_img nvarchar(100)=null
  
)
as
BEGIN
   
	UPDATE dbo.clients
	SET bir_img	= @bir_img WHERE client_id = @client_id
END;
