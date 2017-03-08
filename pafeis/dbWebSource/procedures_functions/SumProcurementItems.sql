
CREATE FUNCTION [dbo].[SumProcurementItems] 
(
	@procurement_id	AS INT
)
RETURNS int
AS
BEGIN   
   DECLARE @l_retval   DECIMAL(18,2);
   SELECT @l_retval = sum(quantity) FROM dbo.procurement_detail WHERE procurement_id = @procurement_id

   RETURN @l_retval;
END;

