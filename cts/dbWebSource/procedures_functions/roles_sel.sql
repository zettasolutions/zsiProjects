CREATE PROCEDURE [dbo].[roles_sel]
(
    @user_id  int = null
   ,@role_id  INT = null
)
AS
BEGIN
DECLARE @client_id INT
SELECT @client_id = client_id FROM dbo.users WHERE user_id=@user_id;
  IF ISNULL(@role_id,0)=0  
     SELECT * FROM dbo.roles where client_id=@client_id;
  ELSE
      SELECT * FROM dbo.roles WHERE role_id = @role_id; 
END


