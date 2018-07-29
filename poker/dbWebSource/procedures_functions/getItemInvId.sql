
CREATE FUNCTION [dbo].[getItemInvId](
  @item_code_id int
 ,@warehouse_id INT
) 
RETURNS int 
AS
BEGIN
   DECLARE @l_return INT; 
      SELECT @l_return = item_inv_id FROM dbo.items_inv  where item_code_id  = @item_code_id and warehouse_id = @warehouse_id
      RETURN @l_return;
END;

 
