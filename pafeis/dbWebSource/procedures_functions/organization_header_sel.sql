
CREATE PROCEDURE [dbo].[organization_header_sel]
(
    @level_no  INT = 1
)
AS
BEGIN

SET NOCOUNT ON

  SELECT organization_type_code + ' CODE' code, organization_type_code +' NAME' name, 
         organization_type_code + ' COMMANDER' commander_name ,'# OF ' + dbo.getSubOrganizationType(@level_no) subOrgCount, ' ACTIVE? ' active, dbo.getOrganizationTypeId(@level_no) organization_type_id FROM organization_types where level_no = @level_no
	
END
