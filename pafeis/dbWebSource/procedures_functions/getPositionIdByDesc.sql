CREATE FUNCTION [dbo].[getPositionIdByDesc](
@position nvarchar(max)
) 
RETURNS INT
AS
BEGIN
   DECLARE @l_retval INT; 
      SELECT @l_retval = position_id FROM dbo.positions where position = @position
      RETURN @l_retval;
END;


