
CREATE PROCEDURE [dbo].[directive_organizations_dd_sel]
(
  @user_id INT 
)
AS
BEGIN

  SELECT * FROM dbo.organizations_v where organization_type_id=2 and organization_id not in (SELECT organization_id FROM dbo.organizations_tree(@user_id) WHERE organization_type_id=2)

END



