
CREATE VIEW [dbo].[items_for_repair_v]
AS
SELECT        dbo.items_inv_v.part_no, dbo.items_inv_v.national_stock_no, dbo.items_inv_v.item_name, dbo.items_inv_v.reorder_level, dbo.items_inv_v.organization_id, dbo.items_inv_v.is_active, dbo.items_inv_v.item_cat_id, 
                         dbo.items_inv_v.item_type_name, dbo.items_inv_v.item_code_id, dbo.items_inv_v.item_inv_id, dbo.items_inv_v.warehouse_id, dbo.items_inv_v.unit_of_measure, dbo.items_inv_v.with_serial, 
                         dbo.items_inv_v.warehouse_location, dbo.items_inv_v.item_cat_name, dbo.item_status_quantity.stock_qty, dbo.item_status_quantity.status_id
FROM            dbo.items_inv_v INNER JOIN
                         dbo.item_status_quantity ON dbo.items_inv_v.item_inv_id = dbo.item_status_quantity.item_inv_id
WHERE        (dbo.item_status_quantity.status_id = 12)

