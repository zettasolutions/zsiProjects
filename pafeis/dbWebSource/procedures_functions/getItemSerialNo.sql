
CREATE FUNCTION [dbo].[getSerialNo](
  @item_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_return VARCHAR(100); 
      SELECT @l_return = serial_no FROM dbo.items  where item_id  = @item_id 
      RETURN @l_return;
END;

 
