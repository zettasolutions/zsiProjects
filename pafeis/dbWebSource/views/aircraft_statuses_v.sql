CREATE VIEW dbo.aircraft_statuses_v
AS
SELECT        status_id, status_name, status_color, is_aircraft, created_by, created_date
FROM            dbo.statuses
WHERE        (is_aircraft = 'Y')
