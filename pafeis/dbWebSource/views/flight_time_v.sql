CREATE VIEW dbo.flight_time_v
AS
SELECT        flight_operation_detail_id, flight_operation_id, format(engine_start, 'MM/dd/yyyy HH:mm:ss') AS engine_start, format(engine_shutdown, 'MM/dd/yyyy HH:mm:ss') AS engine_shutdown, no_hours, remarks
FROM            dbo.flight_time
