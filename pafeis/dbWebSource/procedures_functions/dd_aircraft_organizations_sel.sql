
CREATE PROCEDURE [dbo].[dd_aircraft_organizations_sel] (
   @user_id INT 
)
AS
BEGIN
SET NOCOUNT ON
  DECLARE @stmt NVARCHAR(MAX)
    SET @stmt = 'SELECT organization_id, organization_name FROM dbo.organizations_tree(' + CAST(@user_id AS VARCHAR(20)) + ') 
                  WHERE organization_type_id=2 AND organization_id in (SELECT organization_pid FROM organizations_v WHERE squadron_type=''AIRCRAFT'')
	              UNION
	             SELECT organization_id,organization_name FROM dbo.organizations_tree(' + CAST(@user_id AS VARCHAR(20)) + ') WHERE squadron_type=''AIRCRAFT''';

  EXEC(@stmt);

END;

