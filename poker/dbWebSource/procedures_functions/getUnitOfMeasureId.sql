
CREATE FUNCTION [dbo].[getUnitOfMeasureId](
  @uom nvarchar(50)
) 
RETURNS int
AS
BEGIN
   DECLARE @l_return int; 
      SELECT @l_return = unit_of_measure_id FROM dbo.unit_of_measure where unit_of_measure_name = @uom
      RETURN @l_return;
END;
