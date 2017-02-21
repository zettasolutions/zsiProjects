
CREATE PROCEDURE [dbo].[dd_items_inv_sel]
(

    @warehouse_id int = NULL
   ,@with_stocks  char(1)='Y'
)
AS
BEGIN
SET NOCOUNT ON
  DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT item_inv_id, item_code_id, part_no, national_stock_no, item_code, item_name, stock_qty  FROM dbo.items_v '
  SET @stmt =  @stmt + ' WHERE warehouse_id = ' + cast(@warehouse_id as varchar(20))
  
  IF @with_stocks='Y'
     SET @stmt =  @stmt + ' AND stock_qty > 0 ';

  EXEC(@stmt);

END
