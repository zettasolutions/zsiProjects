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
	 @field	 NVARCHAR(100) = ''
	,@search  NVARCHAR(1000) = ''
)
AS
BEGIN

SET NOCOUNT ON
	
	DECLARE @stmt NVARCHAR(1000) = '';
	DECLARE @orderby NVARCHAR(1000) = '';
   
	SET @stmt = 'SELECT *
	             FROM dbo.items_inv_v 
	             WHERE is_active = ''Y'' '

 
	IF @search <> '' 
		SET @stmt = @stmt +
		'AND ' + @field + ' LIKE ''' + @search + '%'' '

	SET @orderby = 'ORDER BY item_name'

	SET @stmt = @stmt + @orderby;
	
	IF @search <> ''
		EXEC(@stmt);
	ELSE
		SELECT 'No record(s) found.' AS result;  
        RETURN;
END
