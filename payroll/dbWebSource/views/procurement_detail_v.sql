CREATE VIEW dbo.procurement_detail_v
AS
SELECT        dbo.procurement_detail.procurement_detail_id, dbo.procurement_detail.procurement_id, dbo.procurement_detail.item_no, dbo.procurement_detail.item_code_id, dbo.item_codes.part_no, 
                         dbo.item_codes.national_stock_no, dbo.item_codes.item_name AS item_description, dbo.procurement_detail.unit_of_measure_id, dbo.unit_of_measure.unit_of_measure_code, dbo.procurement_detail.quantity, 
                         dbo.procurement_detail.unit_price, dbo.procurement_detail.amount, dbo.procurement_detail.total_delivered_quantity, dbo.procurement_detail.balance_quantity, dbo.procurement_detail.ordered_qty, 
                         dbo.item_codes.item_name, dbo.unit_of_measure.unit_of_measure_name
FROM            dbo.procurement_detail LEFT OUTER JOIN
                         dbo.unit_of_measure ON dbo.procurement_detail.unit_of_measure_id = dbo.unit_of_measure.unit_of_measure_id LEFT OUTER JOIN
                         dbo.item_codes ON dbo.procurement_detail.item_code_id = dbo.item_codes.item_code_id
