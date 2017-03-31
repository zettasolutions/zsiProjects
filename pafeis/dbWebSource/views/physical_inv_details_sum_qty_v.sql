


CREATE VIEW [zsi].[physical_inv_details_sum_qty_v]
AS
SELECT        physical_inv_id, item_code_id, SUM(quantity) AS pi_qty
FROM            dbo.physical_inv_details
GROUP BY physical_inv_id, item_code_id

