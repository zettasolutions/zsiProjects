/****** Object:  View [zsi].[issuance_details_sum_qty_v]    Script Date: 3/23/2017 11:08:32 PM ******/
CREATE VIEW dbo.issuance_details_sum_qty_v
AS
SELECT        dbo.issuance_details.issuance_id, dbo.issuance_details.item_inv_id, dbo.issuance_details.item_status_id, dbo.issuances.warehouse_id, SUM(dbo.issuance_details.quantity) AS is_qty
FROM            dbo.issuance_details INNER JOIN
                         dbo.issuances ON dbo.issuance_details.issuance_id = dbo.issuances.issuance_id
GROUP BY dbo.issuance_details.issuance_id, dbo.issuances.warehouse_id, dbo.issuance_details.item_inv_id, dbo.issuance_details.item_status_id
