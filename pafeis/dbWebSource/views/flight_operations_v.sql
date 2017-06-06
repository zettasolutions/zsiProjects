CREATE VIEW dbo.flight_operations_v
AS
SELECT        dbo.flight_operation.flight_operation_id, dbo.flight_operation.flight_operation_code, dbo.flight_operation.station_id, format(dbo.flight_operation.flight_schedule_date, 'MM/dd/yyyy HH:mm:ss') 
                         AS flight_schedule_date, dbo.flight_operation.aircraft_id, dbo.flight_operation.pilot_id, dbo.flight_operation.co_pilot_id, dbo.flight_operation.no_cycles, dbo.flight_operation_routings_current_v.role_id, 
                         dbo.flight_operation_routings_current_v.process_desc, dbo.getStatusByPageProcessActionId(dbo.flight_operation.status_id) AS status_name, dbo.aircraft_info.squadron_id, dbo.aircraft_info.aircraft_name, 
                         dbo.getUserFullName(dbo.flight_operation.pilot_id) AS pilot_name, dbo.getUserFullName(dbo.flight_operation.co_pilot_id) AS co_pilot_name, dbo.flight_operation.ms_essential, dbo.flight_operation.itinerary, 
                         dbo.flight_operation.ms_category_id, dbo.flight_operation.ms_type_id, dbo.flight_operation.ms_detail_id, dbo.flight_operation.flt_cond, dbo.flight_operation.sort, dbo.flight_operation.pax_mil, 
                         dbo.flight_operation.pax_civ, dbo.flight_operation.fnt_mil, dbo.flight_operation.fnt_civ, dbo.flight_operation.cargo, dbo.flight_operation.gas_up_loc, dbo.flight_operation.gas_up, dbo.flight_operation.gas_bal, 
                         dbo.flight_operation.status_id, dbo.flight_operation.created_by, dbo.flight_operation.created_date, dbo.flight_operation.updated_by, dbo.flight_operation.updated_date, dbo.flight_operation.remarks, 
                         dbo.stations.station_code
FROM            dbo.flight_operation INNER JOIN
                         dbo.flight_operation_routings_current_v ON dbo.flight_operation.flight_operation_id = dbo.flight_operation_routings_current_v.doc_id INNER JOIN
                         dbo.aircraft_info ON dbo.flight_operation.aircraft_id = dbo.aircraft_info.aircraft_info_id LEFT OUTER JOIN
                         dbo.stations ON dbo.flight_operation.station_id = dbo.stations.station_id
