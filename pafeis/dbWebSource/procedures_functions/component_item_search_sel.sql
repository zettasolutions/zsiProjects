-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: December 19, 2016 11:27PM
-- Description:	Select component items search view.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================
CREATE PROCEDURE [dbo].[component_item_search_sel]
(
    @search  NVARCHAR(1000) = ''
   ,@user_id INT
)
AS
BEGIN

SET NOCOUNT ON
	
	DECLARE @stmt NVARCHAR(1000) = '';

   
	SET @stmt = 'SELECT * from dbo.items_inv_v '

	IF @search IS NOT NULL 
		SET @stmt = @stmt +
		'WHERE (part_no LIKE ''%' + @search + '%''
		OR national_stock_no LIKE ''%' + @search + '%''
		OR item_name LIKE ''%' + @search + '%''
		OR item_type_name LIKE ''%' + @search + '%'') 
		and organization_id = ' + cast(dbo.getUserOrganizationId(@user_id) as varchar(20)) 

	EXEC(@stmt);
END


