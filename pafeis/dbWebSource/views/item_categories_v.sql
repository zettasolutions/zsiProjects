
CREATE VIEW [dbo].[item_categories_v]
AS
SELECT        dbo.item_categories.*, dbo.countItemTypes(item_cat_id) AS countItemTypes
FROM            dbo.item_categories

