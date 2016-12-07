CREATE VIEW dbo.items_inv_v
AS
SELECT        dbo.item_codes.part_no, dbo.item_codes.national_stock_no, dbo.item_codes.item_name, dbo.item_codes.reorder_level, dbo.items_inv.organization_id, dbo.items_inv.stock_qty, dbo.item_codes.is_active, 
                         dbo.item_codes.item_code, dbo.item_types.item_cat_id, dbo.item_types.item_type_name, dbo.item_codes.item_code_id
FROM            dbo.item_codes INNER JOIN
                         dbo.items_inv ON dbo.item_codes.item_code_id = dbo.items_inv.item_code_id INNER JOIN
                         dbo.item_types ON dbo.item_codes.item_type_id = dbo.item_types.item_type_id
