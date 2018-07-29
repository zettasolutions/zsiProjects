
CREATE FUNCTION [dbo].[getManufacturerId](
@manufacturer_name nvarchar(50)
) 
RETURNS int
AS
BEGIN
   DECLARE @l_name int; 
      SELECT @l_name = manufacturer_id FROM dbo.manufacturers where manufacturer_name = @manufacturer_name
      RETURN @l_name;
END;



