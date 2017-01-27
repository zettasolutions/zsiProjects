CREATE FUNCTION [dbo].[getItemTypeIdByName](
@item_type_name nvarchar(max)
) 
RETURNS INT
AS
BEGIN
   DECLARE @l_retval INT; 
      SELECT @l_retval = item_type_id FROM dbo.item_types where item_type_name = @item_type_name
      RETURN @l_retval;
END;


