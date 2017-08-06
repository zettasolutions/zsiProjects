
CREATE PROCEDURE [dbo].[dd_aircraft_types_sel]
(
   @user_id           INT = NULL
  ,@wing_id           INT = NULL
  ,@squadron_id       INT = NULL
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
DECLARE @user_organization_id INT;


IF ISNULL(@wing_id,0)= 0 and ISNULL(@squadron_id,0) = 0
BEGIN
   SELECT @user_organization_id=dbo.getUserOrganizationId(@user_id);
   SET @stmt = 'SELECT distinct aircraft_type_id, aircraft_type FROM dbo.aircraft_info_v WHERE organization_id in (select organization_id FROM dbo.org_Child(' + cast(@user_organization_id as varchar(20)) + ')) OR squadron_id IN (select organization_id FROM dbo.org_Child(' + cast(@user_organization_id as varchar(20)) + '))'
END
ELSE
BEGIN
   SET @stmt = 'SELECT aircraft_type_id, aircraft_type, squadron_id, organization_id FROM dbo.aircraft_info_v WHERE 1=1'
   IF ISNULL(@wing_id,0) <> 0
      SET @stmt = @stmt + ' AND organization_id = ' + cast(@wing_id as varchar(20))

   IF ISNULL(@squadron_id,0) <> 0 
      SET @stmt = @stmt + ' AND squadron_id = ' +  CAST(@squadron_id AS VARCHAR(20))
END
Print @stmt;
SET  @stmt = @stmt + ' order by aircraft_type'
EXEC(@stmt);
	
END

