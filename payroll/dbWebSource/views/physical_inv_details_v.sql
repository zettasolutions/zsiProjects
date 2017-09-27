CREATE VIEW dbo.physical_inv_details_v
AS
SELECT        dbo.physical_inv_details.physical_inv_detail_id, dbo.physical_inv_details.physical_inv_id, dbo.physical_inv_details.item_code_id, dbo.physical_inv_details.quantity, dbo.physical_inv_details.bin, 
                         dbo.physical_inv_details.remarks, dbo.physical_inv_details.created_by, dbo.physical_inv_details.created_date, dbo.physical_inv_details.updated_by, dbo.physical_inv_details.updated_date, dbo.physical_inv.warehouse_id, 
                         dbo.physical_inv.organization_id, dbo.physical_inv.physical_inv_no, dbo.physical_inv.physical_inv_date, dbo.physical_inv.done_by, dbo.physical_inv.status_id, dbo.item_codes_v.part_no, 
                         dbo.item_codes_v.national_stock_no, dbo.item_codes_v.item_name, dbo.item_codes_v.unit_of_measure, dbo.getItemInvId(dbo.physical_inv_details.item_code_id, dbo.physical_inv.warehouse_id) AS item_inv_id, 
                         dbo.physical_inv_details.item_status_id
FROM            dbo.physical_inv_details INNER JOIN
                         dbo.physical_inv ON dbo.physical_inv_details.physical_inv_id = dbo.physical_inv.physical_inv_id INNER JOIN
                         dbo.item_codes_v ON dbo.physical_inv_details.item_code_id = dbo.item_codes_v.item_code_id
