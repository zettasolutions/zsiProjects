CREATE PROCEDURE [dbo].[dd_organizations_sel]
(
    @user_id	    INT = null
   ,@squadron_type  NVARCHAR(100)
)
AS
BEGIN

SET NOCOUNT ON

     SELECT organization_id, organization_name FROM dbo.user_aircraft_squadrons(@user_id,@squadron_type) order by organization_name

END

