CREATE VIEW dbo.aircraft_info_search_v
AS
SELECT        TOP (100) PERCENT aircraft_info_id, aircraft_code, aircraft_name, aircraft_time, dbo.getAircraftType(aircraft_type_id) AS aircraft_type, dbo.getOrganizationName(squadron_id) AS squadron, 
                         dbo.getSupplySourceName(aircraft_source_id) AS supply_source, dbo.getDealerName(aircraft_dealer_id) AS dealer, dbo.getStatus(status_id) AS status_name, aircraft_type_id, squadron_id, status_id, service_time, 
                         dbo.getWingId(squadron_id) AS wing_id
FROM            dbo.aircraft_info
