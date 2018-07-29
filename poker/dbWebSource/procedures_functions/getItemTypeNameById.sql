CREATE FUNCTION [dbo].[getItemTypeNameById](
@item_type_id int
) 
RETURNS NVARCHAR(100)
AS
BEGIN
   DECLARE @l_retval NVARCHAR(100); 
      SELECT @l_retval = item_type_name FROM dbo.item_types where item_type_id = @item_type_id
      RETURN @l_retval;
END;


