CREATE FUNCTION [dbo].[getManufacturerName](
@manufacturer_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_name VARCHAR(100); 
      SELECT @l_name = manufacturer_name FROM dbo.manufacturers where manufacturer_id = @manufacturer_id
      RETURN @l_name;
END;


