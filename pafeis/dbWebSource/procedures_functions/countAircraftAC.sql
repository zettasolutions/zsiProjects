
CREATE FUNCTION [dbo].[countAircraftAC] 
(
	@item_id AS INT
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.items WHERE parent_item_id = @item_id

   RETURN @l_retval;
END;

