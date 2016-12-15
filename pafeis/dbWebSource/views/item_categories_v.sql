CREATE VIEW dbo.item_categories_v
AS
SELECT        seq_no, item_cat_code, item_cat_name, is_active, created_by, created_date, updated_by, updated_date, dbo.countItemTypes(item_cat_id) AS countItemTypes, item_cat_id
FROM            dbo.item_categories
