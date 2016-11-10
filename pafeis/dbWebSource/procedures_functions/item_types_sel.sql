CREATE PROCEDURE [dbo].[item_types_sel]
(
    @item_cat_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @item_cat_id IS NOT NULL  
	 SELECT * FROM dbo.item_types_v WHERE item_cat_id = @item_cat_id; 
  ELSE
     SELECT * FROM dbo.item_types_v
	 ORDER BY item_type_name; 
	
END