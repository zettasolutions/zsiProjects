CREATE VIEW dbo.item_codes_v
AS
SELECT        dbo.item_codes.item_code_id, dbo.item_codes.item_code, dbo.item_codes.part_no, dbo.item_codes.national_stock_no, dbo.item_codes.item_name, dbo.item_types_v.item_type_code, 
                         dbo.item_types_v.item_type_name, dbo.item_types_v.monitoring_type_id, dbo.item_types_v.unit_of_measure, dbo.item_types_v.parent_item_type_id, dbo.item_types_v.item_cat_code, 
                         dbo.item_types_v.unit_of_measure_id
FROM            dbo.item_codes INNER JOIN
                         dbo.item_types_v ON dbo.item_codes.item_type_id = dbo.item_types_v.item_type_id
