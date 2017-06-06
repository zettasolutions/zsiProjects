CREATE PROCEDURE [dbo].[aircraft_info_items_upd] (
  @flight_operation_id INT
 ,@user_id      INT
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @ttl_hours DECIMAL(10,2);
DECLARE @aircraft_id INT;
SELECT @ttl_hours = SUM(no_hours) FROM dbo.flight_time_v WHERE flight_operation_id=@flight_operation_id

	UPDATE dbo.aircraft_info SET aircraft_time=(aircraft_time + @ttl_hours) WHERE aircraft_info_id=@aircraft_id
	UPDATE dbo.items  SET remaining_time = remaining_time - @ttl_hours 
	 WHERE aircraft_info_id=@aircraft_id AND dbo.getMonitoringTypeByItemCodeId(item_code_id) = 'HOURS';

END;

