CREATE PROCEDURE [dbo].[item_codes_sel]
(
    @item_type_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @item_type_id IS NOT NULL  
	 SELECT * FROM dbo.item_codes WHERE item_type_id = @item_type_id; 
  ELSE
     SELECT * FROM dbo.item_codes
	 ORDER BY item_name; 
	
END
