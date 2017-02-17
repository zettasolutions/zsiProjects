CREATE VIEW dbo.items_on_stock_v
AS
SELECT        part_no, national_stock_no, item_name, reorder_level, organization_id, stock_qty, is_active, item_code, item_cat_id, item_type_name, item_code_id, item_inv_id, warehouse_id, bin_id, unit_of_measure
FROM            dbo.items_inv_v
WHERE        (stock_qty > 0)
