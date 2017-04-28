
CREATE VIEW [dbo].[physical_inv_details_sum_qty_v]
AS
SELECT        physical_inv_id, item_inv_id, SUM(quantity) AS quantity
FROM            dbo.physical_inv_details_v
GROUP BY physical_inv_id, item_inv_id
