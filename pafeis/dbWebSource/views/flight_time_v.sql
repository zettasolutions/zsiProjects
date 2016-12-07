CREATE VIEW dbo.flight_time_v
AS
SELECT        flight_time_id, flight_operation_id, dbo.getFlightOperationName(flight_operation_id) AS flight_operation_name, flight_take_off_time, flight_landing_time, is_engine_off, no_hours, remarks
FROM            dbo.flight_time
