
CREATE FUNCTION [dbo].[sumProcurementBalanceQty] 
(
	@procurement_id	AS INT
)
RETURNS DECIMAL(18,2)
AS
BEGIN   
   DECLARE @l_retval    DECIMAL(18,2);
   SELECT @l_retval = SUM(balance_quantity) FROM dbo.procurement_detail WHERE procurement_id = @procurement_id

   RETURN @l_retval;
END;

