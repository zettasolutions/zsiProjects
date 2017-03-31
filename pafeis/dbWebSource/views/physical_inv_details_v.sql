
CREATE VIEW [dbo].[physical_inv_details_v]
AS
SELECT        dbo.physical_inv_details.*, dbo.physical_inv.warehouse_id, dbo.physical_inv.organization_id, dbo.physical_inv.physical_inv_date, dbo.physical_inv.done_by, dbo.physical_inv.status_id
FROM            dbo.physical_inv_details INNER JOIN
                         dbo.physical_inv ON dbo.physical_inv_details.physical_inv_id = dbo.physical_inv.physical_inv_id

