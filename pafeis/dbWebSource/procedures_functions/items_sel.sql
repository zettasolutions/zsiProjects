-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 24, 2016 6:46 PM
-- Description:	Select all items or by id records.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================

CREATE PROCEDURE [dbo].[items_sel]
(
    @item_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @item_id IS NOT NULL  
	 SELECT * FROM dbo.items_v WHERE item_id = @item_id
	 ORDER BY item_name, part_no, national_stock_no, serial_no;
  ELSE
     SELECT * FROM dbo.items_v
	 ORDER BY item_name, part_no, national_stock_no, serial_no; 
	
END

