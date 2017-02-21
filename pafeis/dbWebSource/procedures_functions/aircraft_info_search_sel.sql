-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: December 19, 2016 8:55PM
-- Description:	Select stocks monitorng view.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================
CREATE PROCEDURE [dbo].[aircraft_info_search_sel] 
(
    @search  NVARCHAR(1000) = ''
)
AS
BEGIN

SET NOCOUNT ON
	
	DECLARE @stmt NVARCHAR(1000) = '';
   
	SET @stmt = 'SELECT * from dbo.aircraft_info_search_v '

	IF @search IS NOT NULL 
		SET @stmt = @stmt +
		'WHERE aircraft_code LIKE ''%' + @search + '%''
		OR aircraft_name LIKE ''%' + @search + '%'' '

	EXEC(@stmt);
END
