CREATE VIEW dbo.aircraft_info_v
AS
SELECT        aircraft_info_id, aircraft_code, aircraft_name, aircraft_type_id, squadron_id, aircraft_time, aircraft_source_id, aircraft_dealer_id, status_id, created_by, created_date, updated_by, updated_date, 
                         dbo.countAircraftItems(aircraft_info_id) AS countItems, dbo.getStatus(status_id) AS status_name
FROM            dbo.aircraft_info
