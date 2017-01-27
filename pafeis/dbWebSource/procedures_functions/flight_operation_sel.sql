
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 24, 2016 11:39 PM
-- Description:	Flight operations select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[flight_operation_sel]
(
    @flight_operation_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @flight_operation_id IS NOT NULL  
	 SELECT *, 
	        dbo.sumFlightHours(flight_operation_id) total_flight_hours,
			dbo.getFlightOperationType(flight_operation_type_id) operation_type_name,
			dbo.getSquadronName(unit_id) unit_name,
			dbo.getAircraftName(aircraft_id) aircraft_name,
			dbo.getUserFullName(pilot_id) pilot,
			dbo.getUserFullName(co_pilot_id) co_pilot,
			dbo.getStatus(status_id) status_name
	 FROM dbo.flight_operation 
	 WHERE flight_operation_id = @flight_operation_id; 
  ELSE
     SELECT *,
	        dbo.sumFlightHours(flight_operation_id) total_flight_hours,
			dbo.getFlightOperationType(flight_operation_type_id) operation_type_name,
			dbo.getSquadronName(unit_id) unit_name,
			dbo.getAircraftName(aircraft_id) aircraft_name,
			dbo.getUserFullName(pilot_id) pilot,
			dbo.getUserFullName(co_pilot_id) co_pilot,
			dbo.getStatus(status_id) status_name
	 FROM dbo.flight_operation
	 ORDER BY flight_schedule_date DESC; 
	
END


