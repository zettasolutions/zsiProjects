CREATE VIEW dbo.total_disposed_item_qty_v
AS
SELECT        item_id, SUM(quantity) AS totalDisposedQty
FROM            dbo.disposal_item_v
GROUP BY item_id
