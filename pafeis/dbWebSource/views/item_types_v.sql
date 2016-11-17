CREATE VIEW dbo.item_types_v
AS
SELECT        item_type_id, item_cat_id, monitoring_type_id, item_type_code, item_type_name, is_active, created_by, created_date, updated_by, updated_date, unit_of_measure_id, dbo.countItemCodes(item_type_id) 
                         AS countItemCodes
FROM            dbo.item_types
