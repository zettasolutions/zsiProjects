
CREATE FUNCTION [dbo].[countWarehouses] 
(
	@wing_id			as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.warehouses WHERE @wing_id = @wing_id

   RETURN @l_retval;
END;




