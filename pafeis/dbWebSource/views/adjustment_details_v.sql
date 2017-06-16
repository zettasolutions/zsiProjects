CREATE VIEW dbo.adjustment_details_v
AS
SELECT        dbo.adjustment_details.adjustment_detail_id, dbo.adjustment_details.adjustment_id, dbo.adjustment_details.adjustment_type_id, dbo.adjustment_details.item_inv_id, dbo.adjustment_details.serial_no, 
                         dbo.adjustment_details.adjustment_qty, dbo.adjustment_details.created_by, dbo.adjustment_details.created_date, dbo.adjustment_details.updated_by, dbo.adjustment_details.updated_date, 
                         dbo.adjustment_types.adjustment_type, dbo.adjustment_types.debit_credit, dbo.items_inv_v.part_no, dbo.items_inv_v.national_stock_no, dbo.items_inv_v.item_name, dbo.items_inv_v.unit_of_measure, 
                         dbo.adjustment_details.item_status_id, dbo.items_inv_v.item_code_id
FROM            dbo.adjustment_details INNER JOIN
                         dbo.adjustment_types ON dbo.adjustment_details.adjustment_type_id = dbo.adjustment_types.adjustment_type_id INNER JOIN
                         dbo.items_inv_v ON dbo.adjustment_details.item_inv_id = dbo.items_inv_v.item_inv_id
