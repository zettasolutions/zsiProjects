
-- ==============================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: December 14, 2016 6:10 PM
-- Description:	Disposed items select all or by id records.
-- ==============================================================================
-- Updated by	| Date		| Description
-- ==============================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ==============================================================================
CREATE PROCEDURE [dbo].[disposal_item_sel]
(
    @disposal_item_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @disposal_item_id IS NOT NULL  
	 SELECT * FROM dbo.disposal_item_v WHERE disposal_item_id = @disposal_item_id; 
  ELSE
     SELECT * FROM dbo.disposal_item_v
	 ORDER BY disposed_date, item_name; 
	
END

