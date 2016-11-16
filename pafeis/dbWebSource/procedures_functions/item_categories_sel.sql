

CREATE PROCEDURE [dbo].[item_categories_sel]
(
	@user_id int = NULL
   ,@item_cat_id  INT = null
   ,@is_active CHAR(1) = 'Y'
   ,@col_no   int = 1
   ,@order_no int = 0
)
AS
BEGIN
SET NOCOUNT ON
  DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.item_categories_v WHERE is_active=''' + @is_active + '''';


  IF ISNULL(@item_cat_id,0) <> 0
     SET @stmt = @stmt + ' AND item_cat_id=' + cast(@item_cat_id AS VARCHAR(20))

  SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no AS VARCHAR(20))
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC '
  ELSE
     SET @stmt = @stmt + ' DESC '

  EXEC(@stmt);

END



