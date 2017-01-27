CREATE VIEW dbo.aircraft_info_v
AS
SELECT        dbo.aircraft_info.*, dbo.countAircraftItems(aircraft_info_id) AS countItems
FROM            dbo.aircraft_info
