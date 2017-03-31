CREATE VIEW dbo.item_codes_v
AS
SELECT        dbo.item_codes.part_no, dbo.item_codes.national_stock_no, dbo.item_codes.item_name, dbo.item_codes.item_code_id, dbo.item_codes.item_code, dbo.item_codes.critical_level, dbo.item_codes.is_active, 
                         dbo.item_codes.item_type_id, dbo.item_codes.reorder_level, dbo.item_codes.item_cat_id, dbo.item_codes.created_by, dbo.item_codes.created_date, dbo.item_codes.updated_by, dbo.item_codes.updated_date, 
                         dbo.getUnitOfMeasureName(dbo.item_codes.unit_of_measure_id) AS unit_of_measure, dbo.getMonitoringType(dbo.item_codes.monitoring_type_id) AS monitoring_type, dbo.item_codes.monitoring_type_id, 
                         dbo.item_codes.unit_of_measure_id, dbo.getItemTypeNameById(dbo.item_codes.item_type_id) AS item_type_name, dbo.item_categories.item_cat_name, dbo.item_categories.item_cat_code
FROM            dbo.item_codes INNER JOIN
                         dbo.item_categories ON dbo.item_codes.item_cat_id = dbo.item_categories.item_cat_id
