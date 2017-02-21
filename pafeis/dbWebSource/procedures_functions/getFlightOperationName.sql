
CREATE FUNCTION [dbo].[getFlightOperationName](
@flight_operation_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_name VARCHAR(100); 
      SELECT @l_name = flight_operation_name FROM dbo.flight_operation where flight_operation_id = @flight_operation_id
      RETURN @l_name;
END;



