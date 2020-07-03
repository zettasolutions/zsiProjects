
CREATE PROCEDURE [dbo].[dd_users_sel]
(
   @user_id  int = null
)
AS
BEGIN
      SELECT user_id, full_name FROM dbo.users; 
END



