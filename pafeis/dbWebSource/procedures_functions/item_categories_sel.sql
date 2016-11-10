

-- ==========================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 24, 2016 6:46 PM
-- Description:	Item categories select all or by id records.
-- ==========================================================
-- Update by	| Date		| Description
-- ==========================================================
-- RNovo		| 11/7/2016	| Change table to view to add count item types.

CREATE PROCEDURE [dbo].[item_categories_sel]
(
    @item_cat_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @item_cat_id IS NOT NULL  
	 SELECT * FROM dbo.item_categories_v WHERE item_cat_id = @item_cat_id; 
  ELSE
     SELECT * FROM dbo.item_categories_v
	 ORDER BY item_cat_name; 
	
END



