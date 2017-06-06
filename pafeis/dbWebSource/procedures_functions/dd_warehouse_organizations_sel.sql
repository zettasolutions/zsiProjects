
CREATE PROCEDURE [dbo].[dd_warehouse_organizations_sel]
(
@user_id int = null
)
AS
BEGIN

SET NOCOUNT ON

SELECT warehouse_id, organization_warehouse FROM warehouses_v where squadron_id in (select organization_id FROM organizations_v WHERE squadron_type='SUPPLY')

END;

