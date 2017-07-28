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
   ,@col_no   int = 2
   ,@order_no int = 0
   ,@option_id	CHAR(3)=null
   ,@col_name nvarchar(100)=null
   ,@keyword nvarchar(20)=null
   ,@rpp INT = 10
   ,@pno INT = 1
   ,@user_id int=null
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
DECLARE @stmt2 NVARCHAR(MAX)
DECLARE @count		INT = 0;
DECLARE @page_count	INT = 1;
  CREATE TABLE #tt ( 
    rec_count INT
  )


IF ISNULL(@aircraft_info_id,0) =0
BEGIN
   SET @stmt = ' SELECT * FROM dbo.items_v WHERE 1=1 ';
   SET @stmt2 = 'SELECT count(*) FROM dbo.items_v WHERE WHERE 1=1 '
END
ELSE
BEGIN
   SET @stmt = ' SELECT * FROM dbo.aircraft_items_v WHERE aircraft_info_id = ' + cast(@aircraft_info_id as varchar(20)) 
   SET @stmt2 = 'SELECT count(*) FROM dbo.aircraft_items_v WHERE aircraft_info_id = ' + cast(@aircraft_info_id as varchar(20)) 

   IF @option_id = 'C'
	  BEGIN
	   SET @stmt = @stmt + ' AND (remaining_time <= critical_level)'
	   SET @stmt2 = @stmt2 + ' AND AND (remaining_time <= critical_level)'
	  END
END

IF ISNULL(@warehouse_id,0) <> 0
BEGIN
   SET @stmt = @stmt + ' AND warehouse_id = ' + cast(@warehouse_id as varchar(20)) 
   SET @stmt2 = @stmt2 + ' AND warehouse_id = ' + cast(@warehouse_id as varchar(20)) 
END

IF ISNULL(@item_cat_code,'') <> ''
BEGIN
   SET @stmt = @stmt + ' AND item_cat_code IN ( ''' + REPLACE(@item_cat_code,'|',''',''') + ''')'
   SET @stmt2 = @stmt2 + ' AND item_cat_code IN ( ''' + REPLACE(@item_cat_code,'|',''',''') + ''')'
END

IF ISNULL(@item_code_id,0) <> 0
BEGIN
   SET @stmt = @stmt + ' AND item_code_id = ' + cast(@item_code_id as varchar(20)) 
   SET @stmt2 = @stmt2 + ' AND item_code_id = ' + cast(@item_code_id as varchar(20)) 
END

IF ISNULL(@item_id,0) <> 0
BEGIN
   SET @stmt = @stmt + ' AND item_id = ' + cast(@item_id as varchar(20)) 
   SET @stmt2 = @stmt2 + ' AND item_id = ' + cast(@item_id as varchar(20)) 
END

IF ISNULL(@item_inv_id,0) <> 0
BEGIN
   SET @stmt = @stmt + ' AND item_inv_id = ' + cast(@item_inv_id as varchar(20)) 
   SET @stmt2 = @stmt2 + ' AND item_inv_id = ' + cast(@item_inv_id as varchar(20)) 
END

IF ISNULL(@status_id,0) <> 0
BEGIN
   SET @stmt = @stmt + ' AND status_id = ' + cast(@status_id as varchar(20)) 
   SET @stmt2 = @stmt2 + ' AND status_id = ' + cast(@status_id as varchar(20)) 
END

IF ISNULL(@parent_item_id,0) <> 0
BEGIN
   SET @stmt = @stmt + ' AND parent_item_id = ' + cast(@parent_item_id as varchar(20)) 
   SET @stmt2 = @stmt2 + ' AND parent_item_id = ' + cast(@parent_item_id as varchar(20)) 
END
ELSE
BEGIN
   SET @stmt = @stmt + ' AND ISNULL(parent_item_id,0) = 0 '
   SET @stmt2 = @stmt2 + ' AND ISNULL(parent_item_id,0) = 0 '
END

    INSERT INTO #tt EXEC(@stmt2);
    SELECT @count=rec_count FROM #tt;
	DROP TABLE #tt

  SET @stmt = @stmt + ' ORDER BY ' + cast(iif(@col_no=0,2,@col_no) AS VARCHAR(20))
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC '
  ELSE
     SET @stmt = @stmt + ' DESC '
 
	SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY '; 
	EXEC(@stmt);

	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);
	print @page_count
	RETURN IIF(isnull(@page_count,0)=0,1,@page_count);
	
END

