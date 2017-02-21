CREATE VIEW dbo.items_inv_v
AS
SELECT        dbo.item_codes.part_no, dbo.item_codes.national_stock_no, dbo.item_codes.item_name, dbo.item_codes.reorder_level, dbo.items_inv.stock_qty, dbo.item_codes.is_active, dbo.item_codes.item_code, 
                         dbo.item_types.item_cat_id, dbo.item_types.item_type_name, dbo.item_codes.item_code_id, dbo.items_inv.item_inv_id, dbo.items_inv.warehouse_id, dbo.items_inv.bin_id, 
                         dbo.getUnitOfMeasureName(dbo.item_types.unit_of_measure_id) AS unit_of_measure, dbo.item_types.unit_of_measure_id, dbo.warehouses.squadron_id AS organization_id, dbo.item_codes.critical_level
FROM            dbo.item_codes INNER JOIN
                         dbo.items_inv ON dbo.item_codes.item_code_id = dbo.items_inv.item_code_id INNER JOIN
                         dbo.item_types ON dbo.item_codes.item_type_id = dbo.item_types.item_type_id INNER JOIN
                         dbo.warehouses ON dbo.items_inv.warehouse_id = dbo.warehouses.warehouse_id
