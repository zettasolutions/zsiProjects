CREATE PROCEDURE [dbo].[critical_stockpile_report_sel]
(
    @user_id int = NULL
   ,@is_active varchar(1)='Y'
   ,@col_no INT = 3
   ,@order_no INT = 0
   ,@pno INT = 1
   ,@rpp INT = 100
)
AS
BEGIN
	DECLARE @stmt           VARCHAR(4000);
	DECLARE @order          VARCHAR(4000);
	DECLARE @count INT = 0;
	DECLARE @page_count INT = 1;
  
	SET @stmt = 'SELECT b.organization_code, a.part_no, a.national_stock_no, a.item_code_id, a.item_name, a.item_type_name, COUNT(a.stock_qty) AS available_stocks '; 
	SET @stmt = @stmt + 'FROM dbo.items_on_stock_v AS a '
	SET @stmt = @stmt + 'INNER JOIN dbo.organizations AS b ON a.organization_id = b.organization_id ';
	SET @stmt = @stmt + 'WHERE  a.is_active = ''' + CAST(@is_active AS VARCHAR(1)) + ''' ';
	SET @stmt = @stmt + 'GROUP BY b.organization_code, a.part_no, a.national_stock_no, a.item_name, a.item_code_id, a.item_type_name HAVING (COUNT(a.stock_qty) <= 100)'; 
	SET @order = ' ORDER BY ' + CAST(@col_no + 1 AS VARCHAR(1)) + ' ' + IIF(@order_no=0,'ASC','DESC');   
	SELECT @count = COUNT(*) FROM dbo.items_on_stock_v WHERE is_active = @is_active; 

	SET @stmt = @stmt + @order
	SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY '; 
	EXEC(@stmt);

	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);
	--print @page_count;
	RETURN @page_count;
END;



