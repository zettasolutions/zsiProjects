CREATE VIEW dbo.flight_time_v
AS
SELECT        dbo.flight_time.flight_operation_detail_id, dbo.flight_time.flight_operation_id, dbo.getFlightOperationName(dbo.flight_time.flight_operation_id) AS flight_operation_name, dbo.flight_time.flight_take_off_time, 
                         dbo.flight_time.flight_landing_time, dbo.flight_time.is_engine_off, dbo.flight_time.no_hours, dbo.flight_time.remarks, dbo.flight_operation.aircraft_id
FROM            dbo.flight_time INNER JOIN
                         dbo.flight_operation ON dbo.flight_time.flight_operation_id = dbo.flight_operation.flight_operation_id
