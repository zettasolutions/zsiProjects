
CREATE VIEW [dbo].[aircraft_types_v]
AS
SELECT        dbo.aircraft_type.*, dbo.getManufacturerName(manufacturer_id) AS manufacturer_name, dbo.getOriginName(origin_id) AS origin_name, dbo.getAircraftClassName(aircraft_class_id) AS aircraft_class_name, 
                         dbo.getAircraftRoleName(aircraft_role_id) AS aircraft_role_name, dbo.countAircraftTypeItems(aircraft_type_id, NULL) AS countAssembly
FROM            dbo.aircraft_type

