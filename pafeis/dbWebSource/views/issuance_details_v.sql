CREATE VIEW dbo.issuance_details_v
AS
SELECT        dbo.issuance_details.issuance_detail_id, dbo.issuance_details.issuance_id, dbo.issuance_details.aircraft_id, dbo.issuance_details.quantity, dbo.issuance_details.remarks, 
                         dbo.issuances.transfer_warehouse_id, dbo.issuances.organization_id, dbo.issuance_routings_current_v.role_id, dbo.issuance_details.item_inv_id, dbo.issuances.warehouse_id, dbo.items.serial_no, 
                         dbo.items.item_class_id, dbo.items.time_since_new, dbo.items.time_since_overhaul, dbo.items.status_id, dbo.items_inv_v.unit_of_measure, dbo.items_inv_v.stock_qty, dbo.items_inv_v.part_no, 
                         dbo.items_inv_v.item_name, dbo.items_inv_v.national_stock_no, dbo.items_inv_v.item_code, dbo.items_inv_v.item_code_id, dbo.items_inv_v.unit_of_measure_id, dbo.issuances.issued_date, 
                         dbo.items_inv_v.item_cat_id
FROM            dbo.issuances INNER JOIN
                         dbo.issuance_details ON dbo.issuances.issuance_id = dbo.issuance_details.issuance_id INNER JOIN
                         dbo.items_inv_v ON dbo.issuance_details.item_inv_id = dbo.items_inv_v.item_inv_id LEFT OUTER JOIN
                         dbo.items ON dbo.issuance_details.serial_no = dbo.items.serial_no LEFT OUTER JOIN
                         dbo.issuance_routings_current_v ON dbo.issuance_details.issuance_id = dbo.issuance_routings_current_v.doc_id
