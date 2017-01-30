CREATE VIEW dbo.receiving_details_v
AS
SELECT        dbo.receiving_details.receiving_detail_id, dbo.receiving_details.receiving_id, dbo.receiving_details.item_code_id, dbo.receiving_details.serial_no, dbo.receiving_details.unit_of_measure_id, 
                         dbo.receiving_details.quantity, dbo.receiving_details.created_by, dbo.receiving_details.created_date, dbo.receiving_details.updated_by, dbo.receiving_details.updated_date, dbo.receiving_details.remarks, 
                         dbo.receiving_routings_current_v.role_id, dbo.receiving.receiving_organization_id, dbo.item_codes.part_no, dbo.item_codes.national_stock_no, dbo.item_codes.item_name, dbo.item_codes.item_code, 
                         dbo.receiving_details.item_class_id, dbo.receiving_details.time_since_new, dbo.receiving_details.time_before_overhaul, dbo.receiving_details.time_since_overhaul
FROM            dbo.receiving_details INNER JOIN
                         dbo.receiving_routings_current_v ON dbo.receiving_details.receiving_id = dbo.receiving_routings_current_v.doc_id INNER JOIN
                         dbo.receiving ON dbo.receiving_details.receiving_id = dbo.receiving.receiving_id INNER JOIN
                         dbo.item_codes ON dbo.receiving_details.item_code_id = dbo.item_codes.item_code_id
