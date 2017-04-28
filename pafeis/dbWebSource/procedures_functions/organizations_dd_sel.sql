
CREATE PROCEDURE [dbo].[organizations_dd_sel]
(
  @user_id INT 
 ,@organization_type_id INT = NULL
)
AS
BEGIN

 
  IF ISNULL(@organization_type_id,0) <> 0
    SELECT * FROM dbo.organizations_tree(@user_id) WHERE organization_type_id=@organization_type_id
  ELSE
     SELECT * FROM dbo.organizations_tree(@user_id) 

END


