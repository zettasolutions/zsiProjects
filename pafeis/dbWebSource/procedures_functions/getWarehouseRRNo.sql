

CREATE FUNCTION [dbo].[getWarehouseRRNo] 
(
	@warehouse_id			as int
)
RETURNS int
AS
BEGIN   
   DECLARE @l_retval   varchar(50);
   SELECT @l_retval = rr_no FROM dbo.warehouses where warehouse_id = @warehouse_id
   RETURN @l_retval;
END;

