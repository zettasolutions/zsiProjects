CREATE VIEW dbo.flight_time_v
AS
SELECT        dbo.flight_time.flight_operation_detail_id, dbo.flight_time.flight_operation_id, format(dbo.flight_time.engine_start, 'MM/dd/yyyy HH:mm:ss') AS engine_start, format(dbo.flight_time.engine_shutdown, 'MM/dd/yyyy HH:mm:ss') 
                         AS engine_shutdown, dbo.flight_time.no_hours, dbo.flight_time.remarks, dbo.flight_operation.aircraft_id
FROM            dbo.flight_time INNER JOIN
                         dbo.flight_operation ON dbo.flight_time.flight_operation_id = dbo.flight_operation.flight_operation_id
