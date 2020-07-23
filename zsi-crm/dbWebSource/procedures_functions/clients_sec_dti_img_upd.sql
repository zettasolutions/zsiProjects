

CREATE procedure [dbo].[clients_sec_dti_img_upd](
   @client_id  int=null
  ,@user_id   int=null
  ,@sec_dti_img nvarchar(100)=null
  
)
as
BEGIN
   
	UPDATE dbo.clients
	SET sec_dti_img	= @sec_dti_img WHERE client_id = @client_id
END;
