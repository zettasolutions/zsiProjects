
CREATE FUNCTION [dbo].[countItemTypes] 
(
	@item_cat_id AS INT
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.item_types WHERE item_cat_id = @item_cat_id

   RETURN @l_retval;
END;

