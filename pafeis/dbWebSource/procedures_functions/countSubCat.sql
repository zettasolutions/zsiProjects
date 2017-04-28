
CREATE FUNCTION [dbo].[countSubCat] 
(
	@cat_id AS INT
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.item_categories WHERE parent_item_cat_id = @cat_id

   RETURN @l_retval;
END;
