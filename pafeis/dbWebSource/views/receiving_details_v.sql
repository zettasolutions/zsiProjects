CREATE VIEW dbo.receiving_details_v
AS
SELECT        dbo.receiving_details.receiving_detail_id, dbo.receiving_details.receiving_id, dbo.receiving_details.item_code_id, dbo.receiving_details.serial_no, dbo.receiving_details.unit_of_measure_id, 
                         dbo.receiving_details.quantity, dbo.receiving_details.created_by, dbo.receiving_details.created_date, dbo.receiving_details.updated_by, dbo.receiving_details.updated_date, dbo.receiving_details.remarks, 
                         dbo.receiving.warehouse_id, dbo.item_codes_v.part_no, dbo.item_codes_v.national_stock_no, dbo.item_codes_v.item_name, dbo.receiving_details.item_class_id, dbo.receiving_details.time_since_new, 
                         dbo.receiving_details.time_before_overhaul, dbo.receiving_details.time_since_overhaul, dbo.receiving_details.procurement_detail_id, dbo.receiving.doc_date, dbo.receiving.procurement_id, 
                         dbo.receiving_details.manufacturer_id, dbo.receiving_details.status_id, dbo.item_codes_v.unit_of_measure, dbo.item_codes_v.with_serial
FROM            dbo.receiving_details INNER JOIN
                         dbo.receiving ON dbo.receiving_details.receiving_id = dbo.receiving.receiving_id INNER JOIN
                         dbo.item_codes_v ON dbo.receiving_details.item_code_id = dbo.item_codes_v.item_code_id
