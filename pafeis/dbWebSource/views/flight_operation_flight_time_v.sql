CREATE VIEW dbo.flight_operation_flight_time_v
AS
SELECT        dbo.flight_operation.flight_operation_id, dbo.flight_operation.flight_operation_code, dbo.flight_operation.station_id, dbo.flight_operation.flight_schedule_date, dbo.flight_operation.unit_id, 
                         dbo.flight_operation.aircraft_id, dbo.flight_operation.pilot_id, dbo.flight_operation.co_pilot_id, dbo.flight_operation.ms_essential, dbo.flight_operation.itinerary, dbo.flight_operation.ms_category_id, 
                         dbo.flight_operation.ms_type_id, dbo.flight_operation.ms_detail_id, dbo.flight_operation.flt_cond, dbo.flight_operation.sort, dbo.flight_operation.pax_mil, dbo.flight_operation.pax_civ, dbo.flight_operation.fnt_mil, 
                         dbo.flight_operation.fnt_civ, dbo.flight_operation.cargo, dbo.flight_operation.gas_up_loc, dbo.flight_operation.gas_up, dbo.flight_operation.gas_bal, dbo.flight_operation.no_cycles, dbo.flight_operation.remarks, 
                         dbo.flight_operation.status_id, dbo.flight_operation.created_by, dbo.flight_operation.created_date, dbo.flight_operation.updated_by, dbo.flight_operation.updated_date, dbo.flight_operation.total_hours, 
                         dbo.getStationById(dbo.flight_operation.station_id) AS station, dbo.getUserFullName(dbo.flight_operation.pilot_id) AS pilot, dbo.getUserFullName(dbo.flight_operation.co_pilot_id) AS co_pilot, 
                         dbo.getMissionSymbolById(dbo.flight_operation.ms_category_id) AS ms_category, dbo.getMissionSymbolById(dbo.flight_operation.ms_type_id) AS ms_type, 
                         dbo.getMissionSymbolById(dbo.flight_operation.ms_detail_id) AS ms_detail, dbo.getEngineStart(dbo.flight_operation.flight_operation_id) AS engine_start, 
                         dbo.getEngineStop(dbo.flight_operation.flight_operation_id) AS engine_stop, dbo.aircraft_info_v.aircraft_name, dbo.aircraft_info_v.squadron, dbo.aircraft_info_v.wing, dbo.aircraft_info_v.no_cycles AS total_cycles,
                          dbo.aircraft_info_v.squadron_id, dbo.aircraft_info_v.organization_id
FROM            dbo.flight_operation INNER JOIN
                         dbo.aircraft_info_v ON dbo.flight_operation.aircraft_id = dbo.aircraft_info_v.aircraft_info_id
