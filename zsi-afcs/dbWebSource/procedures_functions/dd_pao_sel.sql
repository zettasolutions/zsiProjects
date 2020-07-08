
CREATE PROCEDURE [dbo].[dd_pao_sel]
(
   @user_id  int = null
   ,@client_id int = null
)
AS
BEGIN
      SELECT user_id, full_name FROM dbo.pao_v where client_id = @client_id; 
END


