
CREATE FUNCTION [dbo].[getItemCatIdByName](
@item_cat_name nvarchar(max)
) 
RETURNS INT
AS
BEGIN
   DECLARE @l_retval INT; 
      SELECT @l_retval = item_cat_id FROM dbo.item_categories where item_cat_name = @item_cat_name
      RETURN @l_retval;
END