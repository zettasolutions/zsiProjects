CREATE VIEW dbo.aircraft_info_v
AS
SELECT        dbo.aircraft_info.aircraft_info_id, dbo.aircraft_info.aircraft_code, dbo.aircraft_info.aircraft_name, dbo.aircraft_info.aircraft_type_id, dbo.aircraft_info.squadron_id, dbo.aircraft_info.aircraft_time, 
                         dbo.aircraft_info.aircraft_source_id, dbo.aircraft_info.aircraft_dealer_id, dbo.aircraft_info.status_id, dbo.aircraft_info.created_by, dbo.aircraft_info.created_date, dbo.aircraft_info.updated_by, 
                         dbo.aircraft_info.updated_date, dbo.countAircraftItems(dbo.aircraft_info.aircraft_info_id) AS countItems, dbo.getStatus(dbo.aircraft_info.status_id) AS status_name, dbo.aircraft_info.item_class_id, 
                         dbo.aircraft_types_v.aircraft_type, dbo.aircraft_types_v.manufacturer_name, dbo.aircraft_types_v.origin_name, dbo.aircraft_types_v.introduced_year, dbo.aircraft_types_v.aircraft_role_name, 
                         dbo.aircraft_types_v.aircraft_class_name
FROM            dbo.aircraft_info INNER JOIN
                         dbo.aircraft_types_v ON dbo.aircraft_info.aircraft_type_id = dbo.aircraft_types_v.aircraft_type_id
