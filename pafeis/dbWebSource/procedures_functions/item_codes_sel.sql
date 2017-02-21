
CREATE PROCEDURE [dbo].[item_codes_sel]
(
    @item_type_id  INT = null
   ,@is_active CHAR(1) = 'Y'
   ,@col_no   int = 1
   ,@order_no int = 0
)

AS
BEGIN

  DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.item_codes WHERE is_active=''' + @is_active + '''';


  IF ISNULL(@item_type_id,0) <> 0
     SET @stmt = @stmt + ' AND item_type_id=' + cast(@item_type_id AS VARCHAR(20))

  SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no AS VARCHAR(20))
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC '
  ELSE
     SET @stmt = @stmt + ' DESC '

  EXEC(@stmt);
	
END


