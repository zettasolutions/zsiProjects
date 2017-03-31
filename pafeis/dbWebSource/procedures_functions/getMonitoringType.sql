

CREATE FUNCTION [dbo].[getMonitoringType](
  @monitoring_type_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_return VARCHAR(100); 
      SELECT @l_return = monitoring_type_name FROM dbo.monitoring_types where monitoring_type_id = @monitoring_type_id
      RETURN @l_return;
END;

