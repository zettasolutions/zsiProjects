
CREATE PROCEDURE [dbo].[applications_sel]
(
   @user_id int
)
AS
BEGIN
   declare @client_id INT
   SELECT @client_id = client_id FROM dbo.users where user_id=@user_id;

   SELECT * FROM dbo.applications WHERE client_id = @client_id;


END