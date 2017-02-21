
CREATE FUNCTION [dbo].[getSupplySourceName](
@supply_source_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_name VARCHAR(100); 
      SELECT @l_name = supply_source_name FROM dbo.supply_sources where supply_source_id = @supply_source_id
      RETURN @l_name;
END;


