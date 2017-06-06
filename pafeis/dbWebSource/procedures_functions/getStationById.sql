
CREATE FUNCTION [dbo].[getStationById](
  @station_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_return VARCHAR(100); 
      SELECT @l_return = station_code FROM dbo.stations where station_id = @station_id
      RETURN @l_return;
END;


