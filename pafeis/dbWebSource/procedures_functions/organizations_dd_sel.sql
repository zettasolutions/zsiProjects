
CREATE PROCEDURE [dbo].[organizations_dd_sel]
(
  @user_id INT 
)
AS
BEGIN

  SELECT * FROM dbo.organizations_tree(@user_id)

END


