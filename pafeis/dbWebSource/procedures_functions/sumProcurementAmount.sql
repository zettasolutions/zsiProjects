
CREATE FUNCTION [dbo].[sumProcurementAmount] 
(
	@procurement_id	AS INT
)
RETURNS DECIMAL(18,2)
AS
BEGIN   
   DECLARE @l_retval   DECIMAL(18,2);
   SELECT @l_retval = SUM(amount) FROM dbo.procurement_detail WHERE procurement_id = @procurement_id

   RETURN @l_retval;
END;

