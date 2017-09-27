CREATE VIEW [dbo].[items_for_reorder_v]
AS
SELECT        part_no, national_stock_no, item_name, reorder_level, organization_id, stock_qty, is_active, item_cat_id, item_type_name, item_code_id, item_inv_id, warehouse_id, bin, unit_of_measure, with_serial, 
                         warehouse_location, item_cat_name
FROM            dbo.items_inv_v
WHERE        (stock_qty <= reorder_level)

