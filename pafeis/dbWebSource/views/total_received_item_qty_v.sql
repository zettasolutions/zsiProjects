CREATE VIEW dbo.total_received_item_qty_v
AS
SELECT        item_id, dbo.getItemSerialNo(item_id) AS serial_no, dbo.getItemCodeName(item_id) AS item_codename, unit_of_measure_id, SUM(quantity) AS totalQty
FROM            dbo.receiving_details_v
GROUP BY item_id, unit_of_measure_id
