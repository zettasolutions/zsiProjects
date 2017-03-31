CREATE FUNCTION [dbo].[getItemCatIdByItemCodeId](
  @item_code_id int
) 
RETURNS INT 
AS
BEGIN
   DECLARE @l_return INT; 
      SELECT @l_return = item_cat_id FROM dbo.item_codes_v where item_code_id = @item_code_id
      RETURN @l_return;
END;