-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: December 19, 2016 7:47PM
-- Description:	Select stocks monitorng view.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================
CREATE PROCEDURE [dbo].[stock_monitoring_sel] 
(
    @search  NVARCHAR(1000) = ''
)
AS
BEGIN

SET NOCOUNT ON
	
	DECLARE @stmt NVARCHAR(1000) = '';
	DECLARE @orderby NVARCHAR(1000) = '';
   
	SET @stmt = 'SELECT part_no, national_stock_no, item_code, item_name, item_type_name, 
	             stock_qty,
	             dbo.getOrganizationName(organization_id) AS organization_name
	             FROM dbo.items_on_stock_v 
	             WHERE is_active = ''Y'' '
	IF @search IS NOT NULL 
		SET @stmt = @stmt +
		'AND part_no LIKE ''%' + @search + '%''
		OR national_stock_no LIKE ''%' + @search + '%''
		OR item_name LIKE ''%' + @search + '%'' '

	SET @orderby = 'ORDER BY item_name'

	SET @stmt = @stmt + @orderby;
	
	EXEC(@stmt);
END


