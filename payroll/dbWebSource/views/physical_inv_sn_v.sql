
CREATE VIEW [dbo].[physical_inv_sn_v]
AS
SELECT        dbo.physical_inv_sn.*, dbo.physical_inv.warehouse_id, dbo.getItemInvId(dbo.physical_inv_sn.item_code_id, dbo.physical_inv.warehouse_id) AS item_inv_id
FROM            dbo.physical_inv_sn INNER JOIN
                         dbo.physical_inv ON dbo.physical_inv_sn.physical_inv_id = dbo.physical_inv.physical_inv_id

