

CREATE FUNCTION [dbo].[getSerialNoPlusItemDescription](
  @disposal_item_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_return VARCHAR(100); 
      --SELECT @l_return = serial_no FROM dbo.items  where disposal_item_id  = @disposal_item_id 

	  SELECT @l_return = (ISNULL(dbo.getItemSerialNo(item_id),'') + IIF(dbo.getItemSerialNo(item_id) IS NULL OR
			 dbo.getItemCodeName(item_id) IS NULL, '', N'/') + dbo.getItemCodeName(item_id))
	  FROM dbo.disposal_item
	  WHERE disposal_item_id = @disposal_item_id

      RETURN @l_return;
END;

 

