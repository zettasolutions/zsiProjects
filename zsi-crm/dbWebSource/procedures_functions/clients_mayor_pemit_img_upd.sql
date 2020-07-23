

CREATE procedure [dbo].[clients_mayor_pemit_img_upd](
   @client_id  int=null
  ,@user_id int=null
  ,@mayor_permit_img nvarchar(100)=null
  
)
as
BEGIN
   
	UPDATE dbo.clients
	SET mayor_permit_img = @mayor_permit_img WHERE client_id = @client_id;
END;
