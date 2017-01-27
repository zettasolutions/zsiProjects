

CREATE FUNCTION [dbo].[countWarehouseBins] 
(
	@warehouse_id			as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.warehouse_bins WHERE warehouse_id = @warehouse_id

   RETURN @l_retval;
END;





