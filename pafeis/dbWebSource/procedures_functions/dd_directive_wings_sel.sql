CREATE PROCEDURE [dbo].[dd_directive_wings_sel]
(
    @user_id	    INT = null
)
AS
BEGIN

SET NOCOUNT ON
   DECLARE @organization_id   INT;
   DECLARE @organization_type_code   nvarchar(50);

   SELECT @organization_id = organization_id, @organization_type_code=organization_type_code
     FROM dbo.users_v 
    WHERE user_id = @user_id;


   IF @organization_type_code='SQUADRON'
      SELECT @organization_id=organization_id FROM dbo.org_parent(@organization_id) where organization_type_code='WING'

   SELECT * FROM ORGANIZATIONS_V WHERE ORGANIZATION_TYPE_code='wing' and organization_id <> @organization_id

END