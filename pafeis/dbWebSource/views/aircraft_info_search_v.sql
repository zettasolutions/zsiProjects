CREATE VIEW dbo.aircraft_info_search_v
AS
SELECT        TOP (100) PERCENT aircraft_info_id, aircraft_code, aircraft_name, aircraft_time, dbo.getAircraftType(aircraft_type_id) AS aircraft_type, dbo.getSquadronName(squadron_id) AS squadron, 
                         dbo.getSupplySourceName(aircraft_source_id) AS supply_source, dbo.getDealerName(aircraft_dealer_id) AS dealer, dbo.getStatus(status_id) AS status_name
FROM            dbo.aircraft_info
ORDER BY aircraft_name
