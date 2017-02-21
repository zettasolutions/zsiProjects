

CREATE FUNCTION [dbo].[countWarehouses] 
(
	@squadron_id			as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.warehouses WHERE squadron_id = @squadron_id

   RETURN @l_retval;
END;





