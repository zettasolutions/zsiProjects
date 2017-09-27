CREATE VIEW dbo.aircraft_info_types_v
AS
SELECT        dbo.aircraft_info_v.aircraft_info_id, dbo.aircraft_info_v.aircraft_code, dbo.aircraft_info_v.aircraft_name, dbo.aircraft_info_v.aircraft_type_id, dbo.aircraft_info_v.squadron_id, dbo.aircraft_info_v.aircraft_time, 
                         dbo.aircraft_info_v.aircraft_source_id, dbo.aircraft_info_v.aircraft_dealer_id, dbo.aircraft_info_v.status_id, dbo.aircraft_info_v.countItems, dbo.aircraft_info_v.status_name, dbo.aircraft_info_v.item_class_id, 
                         dbo.aircraft_info_v.aircraft_type, dbo.aircraft_types_v.manufacturer_name, dbo.aircraft_types_v.origin_name, dbo.aircraft_types_v.aircraft_class_name, dbo.aircraft_types_v.aircraft_role_name, 
                         dbo.aircraft_types_v.introduced_year, dbo.aircraft_types_v.in_service, dbo.aircraft_types_v.note
FROM            dbo.aircraft_info_v INNER JOIN
                         dbo.aircraft_types_v ON dbo.aircraft_info_v.aircraft_type_id = dbo.aircraft_types_v.aircraft_type_id
