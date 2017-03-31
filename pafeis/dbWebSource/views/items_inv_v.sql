CREATE VIEW dbo.items_inv_v
AS
SELECT        dbo.item_codes_v.part_no, dbo.item_codes_v.national_stock_no, dbo.item_codes_v.item_name, dbo.item_codes_v.reorder_level, dbo.items_inv.stock_qty, dbo.item_codes_v.is_active, 
                         dbo.items_inv.item_inv_id, dbo.items_inv.warehouse_id, dbo.item_codes_v.unit_of_measure_id, dbo.warehouses.squadron_id AS organization_id, dbo.item_codes_v.item_cat_id, 
                         dbo.item_codes_v.item_type_id, dbo.warehouses.warehouse_location, dbo.items_inv.bin_id, dbo.item_codes_v.item_code_id, dbo.item_codes_v.critical_level, dbo.item_codes_v.monitoring_type, 
                         dbo.item_codes_v.monitoring_type_id, dbo.item_codes_v.item_type_name, dbo.item_codes_v.item_cat_name, dbo.item_codes_v.item_cat_code, dbo.item_codes_v.unit_of_measure
FROM            dbo.items_inv INNER JOIN
                         dbo.warehouses ON dbo.items_inv.warehouse_id = dbo.warehouses.warehouse_id INNER JOIN
                         dbo.item_codes_v ON dbo.items_inv.item_code_id = dbo.item_codes_v.item_code_id
