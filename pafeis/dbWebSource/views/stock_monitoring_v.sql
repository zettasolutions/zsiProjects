CREATE VIEW dbo.stock_monitoring_v
AS
SELECT        a.item_id, a.serial_no, a.item_codename, a.unit_of_measure_id, a.totalQty - b.totalDisposedQty AS remainingStocks
FROM            dbo.total_received_item_qty_v AS a INNER JOIN
                         dbo.total_disposed_item_qty_v AS b ON a.item_id = b.item_id
