CREATE VIEW dbo.item_types_v
AS
SELECT        dbo.item_types.item_type_id, dbo.item_types.item_cat_id, dbo.item_types.item_type_code, dbo.item_types.item_type_name, dbo.item_types.is_active, dbo.item_types.created_by, dbo.item_types.created_date, 
                         dbo.item_types.updated_by, dbo.item_types.updated_date, dbo.countItemCodes(dbo.item_types.item_type_id) AS countItemCodes, dbo.item_categories.item_cat_code, dbo.item_types.parent_item_type_id
FROM            dbo.item_types INNER JOIN
                         dbo.item_categories ON dbo.item_types.item_cat_id = dbo.item_categories.item_cat_id
