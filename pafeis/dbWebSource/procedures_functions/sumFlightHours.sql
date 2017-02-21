

CREATE FUNCTION [dbo].[sumFlightHours] 
(
	@flight_operation_id AS INT
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = SUM(no_hours) FROM dbo.flight_time  WHERE flight_operation_id = @flight_operation_id

   RETURN @l_retval;
END;


