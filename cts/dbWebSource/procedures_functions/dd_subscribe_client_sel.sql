
CREATE PROCEDURE [dbo].[dd_subscribe_client_sel]
(
   @user_id int
)
AS
BEGIN
   declare @client_id INT
   SELECT @client_id = client_id FROM dbo.users where user_id=@user_id;

   SELECT client_id, client_name FROM dbo.clients WHERE client_id <> @client_id;


END
-- dd_subscribe_client_sel @user_id=7

