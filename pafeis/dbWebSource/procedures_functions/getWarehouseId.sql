

CREATE FUNCTION [dbo].[getWarehouseId] 
(
	@warehouse_code nvarchar(100)
)
RETURNS int
AS
BEGIN   
   DECLARE @l_retval   int;
   SELECT @l_retval = warehouse_id FROM dbo.warehouses where warehouse_code = @warehouse_code
   RETURN @l_retval;
END;

