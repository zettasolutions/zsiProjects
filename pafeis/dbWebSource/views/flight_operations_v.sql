CREATE VIEW dbo.flight_operations_v
AS
SELECT        dbo.flight_operation.flight_operation_id, dbo.flight_operation.flight_operation_code, dbo.flight_operation.flight_operation_name, dbo.flight_operation.flight_operation_type_id, 
                         format(dbo.flight_operation.flight_schedule_date, 'MM/dd/yyyy HH:mm:ss') AS flight_schedule_date, dbo.flight_operation.unit_id, dbo.flight_operation.aircraft_id, dbo.flight_operation.pilot_id, 
                         dbo.flight_operation.co_pilot_id, dbo.flight_operation.origin, dbo.flight_operation.destination, dbo.flight_operation.status_id, dbo.flight_operation.created_by, dbo.flight_operation.created_date, 
                         dbo.flight_operation.updated_by, dbo.flight_operation.updated_date, dbo.flight_operation.no_cycles, dbo.flight_operation_routings_current_v.role_id, dbo.flight_operation_routings_current_v.process_desc, 
                         dbo.getStatusByPageProcessActionId(dbo.flight_operation.status_id) AS status_name, dbo.aircraft_info.squadron_id, dbo.aircraft_info.aircraft_name, dbo.getUserFullName(dbo.flight_operation.pilot_id) 
                         AS pilot_name, dbo.getUserFullName(dbo.flight_operation.co_pilot_id) AS co_pilot_name, dbo.getFlightOperationType(dbo.flight_operation.flight_operation_type_id) AS flight_operation_type_name
FROM            dbo.flight_operation INNER JOIN
                         dbo.flight_operation_routings_current_v ON dbo.flight_operation.flight_operation_id = dbo.flight_operation_routings_current_v.doc_id INNER JOIN
                         dbo.aircraft_info ON dbo.flight_operation.aircraft_id = dbo.aircraft_info.aircraft_info_id
