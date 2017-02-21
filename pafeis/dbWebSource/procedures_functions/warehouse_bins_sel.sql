

CREATE PROCEDURE [dbo].[warehouse_bins_sel]
(
  @warehouse_id int
 ,@col_no   int = 1
 ,@order_no int = 0
 ,@is_active char(1)='Y'

)
AS
BEGIN
  DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.warehouse_bins WHERE is_active=''' + @is_active + ''' AND warehouse_id=' + cast(@warehouse_id AS VARCHAR(100));

  SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no AS VARCHAR(20))
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC '
  ELSE
     SET @stmt = @stmt + ' DESC '
 --print (@stmt)
  EXEC(@stmt)
END


