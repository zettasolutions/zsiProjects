CREATE PROCEDURE [dbo].[component_remaining_time_report_sel]
(
    @user_id int = NULL
   ,@col_no INT = 3
   ,@order_no INT = 0
   ,@pno INT = 1
   ,@rpp INT = 100
)
AS
BEGIN

--temporary suspend 
return;

	DECLARE @stmt           VARCHAR(4000);
	DECLARE @order          VARCHAR(4000);
	DECLARE @count			INT = 0;
	DECLARE @page_count		INT = 1;

	CREATE TABLE #TempTable(unit VARCHAR(500),part_no VARCHAR(100),item_code VARCHAR(50),item_name VARCHAR(500),national_stock_no VARCHAR(50),serial_no VARCHAR(50),organization_address VARCHAR(500),remaining_time VARCHAR(20),status_name VARCHAR(100))

	INSERT INTO #TempTable
	SELECT b.organization_code, c.part_no, a.item_code_id, a.item_name, c.national_stock_no, a.serial_no,b.organization_address, 
		   CAST(a.remaining_time AS VARCHAR(100)) + ':' + CAST(a.remaining_time AS VARCHAR(100)) AS remaining_time, 
		   dbo.getStatus(a.status_id) AS status_name 
	FROM dbo.items_v AS a 
	INNER JOIN dbo.organizations AS b ON a.organization_id = b.organization_id 
	INNER JOIN dbo.item_codes AS c ON a.item_code_id = c.item_code_id 
	WHERE (CAST(a.remaining_time AS VARCHAR(100)) + ':' + CAST(a.remaining_time AS VARCHAR(100))) <= 100 
	AND a.item_cat_id = 23
	ORDER BY b.organization_code, c.part_no, a.item_code_id, a.item_name, c.national_stock_no, a.serial_no;
  
	SELECT @count = COUNT(*) FROM #TempTable;
	
	SET @stmt = 'SELECT * FROM #TempTable ORDER BY 4 ';

	SET @stmt = @stmt + 'OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY '; 
	
	EXEC(@stmt);

	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);

	RETURN @page_count;

	DROP TABLE #TempTable;
END;



