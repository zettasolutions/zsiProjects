CREATE PROCEDURE [dbo].[critical_stockpile_report_sel]
(
    @user_id int = NULL
   ,@is_active varchar(1)='Y'
   ,@warehouse_id int 
   ,@item_cat_id INT=NULL
)
AS
BEGIN
	DECLARE @stmt           VARCHAR(4000);
  
	SET @stmt = 'SELECT  warehouse_location, item_cat_name, part_no, national_stock_no,  item_name, stock_qty, unit_of_measure, reorder_level '; 
	SET @stmt = @stmt + 'FROM dbo.items_on_stock_v '
	SET @stmt = @stmt + 'WHERE is_active = ''' + CAST(@is_active AS VARCHAR(1)) + ''' ';
	SET @stmt = @stmt + 'AND warehouse_id=' + cast(@warehouse_id as varchar(20))
	IF ISNULL(@item_cat_id,0) <> 0
	   SET @stmt = @stmt + 'AND item_cat_id=' + cast(@item_cat_id as varchar(20))

	SET @stmt = @stmt + ' ORDER BY warehouse_location, item_name '
	EXEC(@stmt);


END;


