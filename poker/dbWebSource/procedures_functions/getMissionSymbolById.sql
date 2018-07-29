
CREATE FUNCTION [dbo].[getMissionSymbolById](
  @mission_symbol_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_return VARCHAR(100); 
      SELECT @l_return = ms_code FROM dbo.mission_symbols where ms_id = @mission_symbol_id
      RETURN @l_return;
END;


