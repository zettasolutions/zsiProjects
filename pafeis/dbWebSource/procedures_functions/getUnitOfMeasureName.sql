
CREATE FUNCTION [dbo].[getUnitOfMeasureName](
  @unit_of_measure_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_return VARCHAR(100); 
      SELECT @l_return = unit_of_measure_name FROM dbo.unit_of_measure where unit_of_measure_id = @unit_of_measure_id
      RETURN @l_return;
END;
