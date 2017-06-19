

CREATE FUNCTION [dbo].[getItemClass](
  @item_class_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_return VARCHAR(100); 
      SELECT @l_return = item_class_name FROM dbo.item_class  where item_class_id  = @item_class_id 
      RETURN @l_return;
END;

 

