

CREATE FUNCTION [dbo].[getSupplySourceId](
@supply_source NVARCHAR(50)
) 
RETURNS INT 
AS
BEGIN
   DECLARE @l_name INT; 
      SELECT @l_name = supply_source_id FROM dbo.supply_sources where supply_source_name = @supply_source
      RETURN @l_name;
END;



