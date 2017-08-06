CREATE PROCEDURE [dbo].[dd_organizations_sel]
(
    @user_id	    INT = null
   ,@organization_type_code Nvarchar(100) = null
   ,@squadron_type  NVARCHAR(100)
   ,@organization_id INT=NULL

)
AS
BEGIN

SET NOCOUNT ON

     SELECT organization_id, organization_name FROM dbo.user_squadrons(@user_id,@organization_type_code, @squadron_type,@organization_id) order by organization_name

END

