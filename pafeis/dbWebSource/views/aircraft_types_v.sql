CREATE VIEW dbo.aircraft_types_v
AS
SELECT        aircraft_type_id, aircraft_type, dbo.getManufacturerName(manufacturer_id) AS manufacturer_name, dbo.getOriginName(origin_id) AS origin_name, dbo.getAircraftClassName(aircraft_class_id) 
                         AS aircraft_class_name, dbo.getAircraftRoleName(aircraft_role_id) AS aircraft_role_name, introduced_year, in_service, note, is_active
FROM            dbo.aircraft_type
