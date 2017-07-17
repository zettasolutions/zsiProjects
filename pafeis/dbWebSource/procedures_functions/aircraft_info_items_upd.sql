CREATE PROCEDURE [dbo].[aircraft_info_items_upd] (
  @flight_operation_id INT
 ,@user_id      INT
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @ttl_hours DECIMAL(10,2);
DECLARE @cycles    INT;
DECLARE @aircraft_id INT;
   
    SELECT @cycles=no_cycles FROM dbo.flight_operation WHERE flight_operation_id=@flight_operation_id
    SELECT @ttl_hours = SUM(no_hours), @aircraft_id=aircraft_id FROM dbo.flight_time_v WHERE flight_operation_id=@flight_operation_id
    GROUP BY aircraft_id;

	UPDATE dbo.aircraft_info SET aircraft_time=(isnull(aircraft_time,0) + @ttl_hours), service_time = (isnull(service_time,0) - @ttl_hours) WHERE aircraft_info_id=@aircraft_id
	
	UPDATE dbo.items  SET remaining_time = isnull(remaining_time,0) - @ttl_hours 
	 WHERE aircraft_info_id=@aircraft_id AND dbo.getMonitoringTypeByItemCodeId(item_code_id) = 'HOURS';
    
	UPDATE dbo.items  SET remaining_time = isnull(remaining_time,0) - @cycles 
	 WHERE aircraft_info_id=@aircraft_id AND dbo.getMonitoringTypeByItemCodeId(item_code_id) = 'CYCLE';   

END;

