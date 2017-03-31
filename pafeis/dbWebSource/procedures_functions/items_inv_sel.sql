
CREATE PROCEDURE [dbo].[items_inv_sel]
(
      @warehouse_id INT 
	 ,@item_cat_id  INT = null
	 ,@option_id	CHAR(3)
	 ,@col_name nvarchar(100)=null
     ,@keyword nvarchar(20)=null
     ,@col_no   int = 1
     ,@order_no int = 0
     ,@pno INT = 1
     ,@rpp INT = 25
     ,@user_id INT = NULL
)
AS
BEGIN
SET NOCOUNT ON
  DECLARE @stmt         NVARCHAR(MAX)
  DECLARE @stmt2		NVARCHAR(MAX)
  DECLARE @order        VARCHAR(4000);
  DECLARE @count		INT = 0;
  DECLARE @page_count	INT = 1;
  CREATE TABLE #tt ( 
    rec_count INT
  )

	SET @stmt = 'SELECT  part_no, national_stock_no, item_name, item_type_name, stock_qty, reorder_level, item_code_id, warehouse_id 
				 FROM dbo.items_inv_v WHERE is_active=''Y'' AND warehouse_id = ' + cast(@warehouse_id as varchar(20))
	SET @stmt2 = 'SELECT count(*) FROM dbo.items_inv_v WHERE is_active=''Y'' AND warehouse_id = ' + cast(@warehouse_id as varchar(20))

	IF isnull(@item_cat_id,0) <> 0
	BEGIN
	   SET @stmt = @stmt + ' AND item_cat_id = ' + cast(@item_cat_id as varchar(20))
	   SET @stmt2 = @stmt2 + ' AND item_cat_id=' + cast(@item_cat_id AS VARCHAR(20))
	END

    IF @col_name IS NOT NULL AND @keyword IS NOT NULL
	BEGIN
	   SET @stmt = @stmt + ' AND ' + @col_name + ' like ''' + @keyword + '%'''
	   SET @stmt2 = @stmt2 + ' AND ' + @col_name + ' like ''' + @keyword + '%'''
	END

	IF @option_id = 'R'
	BEGIN
	   SET @stmt = @stmt + ' AND (reorder_level >= stock_qty or stock_qty = 0)'
	   SET @stmt2 = @stmt2 + ' AND (reorder_level >= stock_qty or stock_qty = 0)'
	END

   SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no AS VARCHAR(20))
   IF @order_no = 0
      SET @stmt = @stmt + ' ASC '
   ELSE
      SET @stmt = @stmt + ' DESC '

    INSERT INTO #tt EXEC(@stmt2);
    SELECT @count=rec_count FROM #tt;
	DROP TABLE #tt

	SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY '; 
	EXEC(@stmt);

	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);

	print @page_count;
	RETURN IIF(isnull(@page_count,0)=0,1,@page_count);

	
END

