
CREATE FUNCTION [dbo].[getItemStatusQty](
  @item_inv_id int
 ,@status_id   int = NULL
) 
RETURNS decimal(10,2)
AS
BEGIN
   DECLARE @l_value decimal(10,2); 
   IF ISNULL(@status_id,0) = 0
      SELECT @l_value=sum(stock_qty) FROM dbo.item_status_quantity WHERE item_inv_id = @item_inv_id
   ELSE 
      SELECT @l_value=stock_qty FROM dbo.item_status_quantity WHERE item_inv_id = @item_inv_id AND status_id=@status_id
      
RETURN @l_value;
END;
