

CREATE FUNCTION [dbo].[getFlightOperationType](
@operation_type_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_name VARCHAR(100); 
      SELECT @l_name = operation_type_name FROM dbo.operation_types WHERE operation_type_id = @operation_type_id
      RETURN @l_name;
END;

