
CREATE FUNCTION [dbo].[countItemCodes] 
(
	@item_type_id AS INT
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.item_codes WHERE item_type_id = @item_type_id and is_active='Y'

   RETURN @l_retval;
END;

