CREATE FUNCTION [dbo].[getItemCodeName](
  @item_code_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_return VARCHAR(100); 
      SELECT @l_return = item_description FROM dbo.item_codes_search_v where item_code_id = @item_code_id
      RETURN @l_return;
END;