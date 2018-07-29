
CREATE FUNCTION [dbo].[getDealerId](
@dealer_name nvarchar(50)
) 
RETURNS int 
AS
BEGIN
   DECLARE @l_name int;
      SELECT @l_name = dealer_id FROM dbo.dealers where dealer_name = @dealer_name
      RETURN @l_name;
END;



