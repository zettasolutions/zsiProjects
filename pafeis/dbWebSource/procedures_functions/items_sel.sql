-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 24, 2016 6:46 PM
-- Description:	Select all items or by id records.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- GT             01-03-17    Changed to dynamic.
-- ===================================================================================================

CREATE PROCEDURE [dbo].[items_sel]
(
    @item_id  INT = null
   ,@item_code_id  INT = null
   ,@aircraft_info_id INT = NULL
   ,@warehouse_id int = null
   ,@item_cat_code nvarchar(20)=null
   ,@parent_item_id INT=NULL
   ,@item_inv_id int = null
   ,@status_id int = null
 
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
IF ISNULL(@aircraft_info_id,0) =0
   SET @stmt = ' SELECT * FROM dbo.items_v WHERE 1=1 ';
ELSE
   SET @stmt = ' SELECT * FROM dbo.aircraft_items_v WHERE 1=1 ';

IF ISNULL(@aircraft_info_id,0) <> 0
   SET @stmt = @stmt + ' AND aircraft_info_id = ' + cast(@aircraft_info_id as varchar(20)) 

IF ISNULL(@warehouse_id,0) <> 0
   SET @stmt = @stmt + ' AND warehouse_id = ' + cast(@warehouse_id as varchar(20)) 

IF ISNULL(@item_cat_code,'') <> ''
   SET @stmt = @stmt + ' AND item_cat_code IN ( ''' + REPLACE(@item_cat_code,'|',''',''') + ''')'


IF ISNULL(@item_code_id,0) <> 0
   SET @stmt = @stmt + ' AND item_code_id = ' + cast(@item_code_id as varchar(20)) 

IF ISNULL(@item_id,0) <> 0
   SET @stmt = @stmt + ' AND item_id = ' + cast(@item_id as varchar(20)) 

IF ISNULL(@item_inv_id,0) <> 0
   SET @stmt = @stmt + ' AND item_inv_id = ' + cast(@item_inv_id as varchar(20)) 

IF ISNULL(@status_id,0) <> 0
   SET @stmt = @stmt + ' AND status_id = ' + cast(@status_id as varchar(20)) 

IF ISNULL(@parent_item_id,0) <> 0
   SET @stmt = @stmt + ' AND parent_item_id = ' + cast(@parent_item_id as varchar(20)) 
ELSE
   SET @stmt = @stmt + ' AND ISNULL(parent_item_id,0) = 0 '

SET @stmt = @stmt + ' ORDER BY serial_no'; 

--PRINT @stmt;
EXEC(@stmt);	
END

