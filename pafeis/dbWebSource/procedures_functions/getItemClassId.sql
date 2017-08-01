


create FUNCTION [dbo].[getItemClassId] 
(
	@item_class			as nvarchar(50)
)
RETURNS int
AS
BEGIN   
   DECLARE @l_retval  int;
   SELECT @l_retval = item_class_id FROM dbo.item_class where item_class_code = @item_class
   RETURN @l_retval;
END;


