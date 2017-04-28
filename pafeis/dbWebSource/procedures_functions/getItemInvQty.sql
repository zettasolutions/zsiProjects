
CREATE FUNCTION [dbo].[getItemInvQty](
  @item_inv_id int
) 
RETURNS DECIMAL(18,2) 
AS
BEGIN
   DECLARE @l_return DECIMAL(18,2); 
      SELECT @l_return = stock_qty FROM dbo.items_inv  where item_inv_id  = @item_inv_id
      RETURN @l_return;
END;

 
