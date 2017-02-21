-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: December 5, 2016 5:54 PM
-- Description:	Search concatenated Part & NSN Number with Item Description.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================
CREATE PROCEDURE [dbo].[items_code_search_sel]

AS
BEGIN

	SET NOCOUNT ON;

	SELECT item_code_id, isnull(part_no, '') + IIF(part_no IS NULL OR
		   national_stock_no IS NULL, '', N'/') + isnull(national_stock_no, '') + IIF(part_no IS NULL AND national_stock_no IS NULL, '', N' ') + item_name AS item_description
	FROM dbo.item_codes

	--SELECT ISNULL(part_no, '') + IIF(part_no IS NULL OR
	--	   national_stock_no IS NULL, '', N'/') + ISNULL(national_stock_no, '') + IIF(part_no IS NULL AND national_stock_no IS NULL, '', N' ') + item_name AS label
	--	   , item_code_id AS value
	--FROM dbo.item_codes

END
