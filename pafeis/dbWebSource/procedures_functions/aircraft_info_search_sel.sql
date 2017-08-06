---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
    @squadron_id INT = NULL,
    @aircraft_type_id INT = NULL,
    @status_id INT = NULL,
    @search  NVARCHAR(1000) = ''
)
AS
BEGIN

SET NOCOUNT ON
	
	DECLARE @stmt NVARCHAR(1000) = '';
 	DECLARE @stmt2 NVARCHAR(1000) = '';
  
	SET @stmt = 'SELECT * from dbo.aircraft_info_search_v where 1=1 '
	SET @stmt2 = 'SELECT * from dbo.aircraft_info_search_v where 1=1 '

	IF ISNULL(@squadron_id,0) <> 0
	BEGIN
	   SET @stmt = @stmt + ' AND squadron_id = ' + cast(@squadron_id as varchar(20)) 
	   SET @stmt2 = @stmt2 + ' AND @squadron_id = ' + cast(@squadron_id as varchar(20)) 
	END

	IF ISNULL(@aircraft_type_id,0) <> 0
	BEGIN
	   SET @stmt = @stmt + ' AND aircraft_type_id = ' + cast(@aircraft_type_id as varchar(20)) 
	   SET @stmt2 = @stmt2 + ' AND aircraft_type_id = ' + cast(@aircraft_type_id as varchar(20)) 
	END

    IF ISNULL(@status_id,0) <> 0
	BEGIN
	   SET @stmt = @stmt + ' AND status_id = ' + cast(@status_id as varchar(20)) 
	   SET @stmt2 = @stmt2 + ' AND status_id = ' + cast(@status_id as varchar(20)) 
	END

	IF isnull(@search,'')<>''
	BEGIN
		SET @stmt = @stmt +
		' and aircraft_code LIKE ''%' + @search + '%''
		OR aircraft_name LIKE ''%' + @search + '%'' '

        SET @stmt2 = @stmt2 +
		' and aircraft_code LIKE ''%' + @search + '%''
		OR aircraft_name LIKE ''%' + @search + '%'' '
	END
	PRINT @stmt;
	EXEC(@stmt);
END

