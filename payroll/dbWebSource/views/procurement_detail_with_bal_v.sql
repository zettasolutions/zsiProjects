

CREATE VIEW [dbo].[procurement_detail_with_bal_v]
AS
SELECT        dbo.procurement_detail.procurement_detail_id, dbo.procurement_detail.procurement_id, dbo.procurement_detail.item_no, dbo.procurement_detail.item_code_id, dbo.item_codes_v.part_no, 
              dbo.item_codes_v.national_stock_no, dbo.item_codes_v.item_code + N': ' + dbo.item_codes_v.item_name AS item_description, dbo.item_codes_v.with_serial, dbo.procurement_detail.unit_of_measure_id, dbo.unit_of_measure.unit_of_measure_code,
              dbo.procurement_detail.quantity, dbo.procurement_detail.unit_price, dbo.procurement_detail.amount, dbo.procurement_detail.total_delivered_quantity, dbo.procurement_detail.balance_quantity, 
              dbo.procurement_detail.ordered_qty, dbo.item_codes_v.item_name, dbo.unit_of_measure.unit_of_measure_name, dbo.procurement_v.procurement_code, dbo.procurement_v.supplier_name, 
              dbo.procurement_v.procurement_type, dbo.procurement_v.procurement_mode, dbo.procurement_v.delivery_timing, dbo.procurement_v.promised_delivery_date
FROM          dbo.procurement_detail INNER JOIN
              dbo.procurement_v ON dbo.procurement_detail.procurement_id = dbo.procurement_v.procurement_id LEFT OUTER JOIN
              dbo.unit_of_measure ON dbo.procurement_detail.unit_of_measure_id = dbo.unit_of_measure.unit_of_measure_id LEFT OUTER JOIN
              dbo.item_codes_v ON dbo.procurement_detail.item_code_id = dbo.item_codes_v.item_code_id
WHERE        (dbo.procurement_detail.balance_quantity > 0)



