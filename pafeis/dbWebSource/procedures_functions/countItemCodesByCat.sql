

CREATE FUNCTION [dbo].[countItemCodesByCat] 
(
	@item_cat_id AS INT
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.item_codes WHERE item_cat_id = @item_cat_id and is_active='Y'

   RETURN @l_retval;
END;


