
CREATE PROCEDURE [dbo].[item_class_sel]
(
    @item_class_id  INT = null
   ,@is_active CHAR(1) = 'Y'
   ,@col_no   int = 1
   ,@order_no int = 0
)
AS
BEGIN
SET NOCOUNT ON
  DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.item_class WHERE is_active=''' + @is_active + '''';


  IF ISNULL(@item_class_id,0) <> 0
     SET @stmt = @stmt + ' AND item_class_id=' + cast(@item_class_id AS VARCHAR(20))

  SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no AS VARCHAR(20))
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC '
  ELSE
     SET @stmt = @stmt + ' DESC '

  EXEC(@stmt);

END
