


CREATE FUNCTION [dbo].[getMonitoringTypeId](
  @monitoring_type nvarchar(50)
) 
RETURNS int
AS
BEGIN
   DECLARE @l_return int; 
      SELECT @l_return = monitoring_type_id FROM dbo.monitoring_types where monitoring_type_name = @monitoring_type
      RETURN @l_return;
END;


