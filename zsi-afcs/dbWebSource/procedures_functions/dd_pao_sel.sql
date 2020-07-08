
CREATE PROCEDURE [dbo].[dd_pao_sel]
(
   @user_id  int = null
)
AS
BEGIN
      SELECT user_id, full_name FROM dbo.pao_v; 
END


