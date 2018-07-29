
CREATE FUNCTION [dbo].[getItemCodeId](
  @part_no nvarchar(100)
) 
RETURNS INT 
AS
BEGIN
   DECLARE @l_return INT; 
      SELECT @l_return = item_code_id FROM dbo.item_codes where part_no = @part_no
      RETURN @l_return;
END;