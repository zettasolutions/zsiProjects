

CREATE PROCEDURE [dbo].[purchases_sel] (
  @is_served char(1)=NULL
 ,@year      int =null
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
   SET @stmt = 'SELECT *, month(purchase_date) pmonth, year(purchase_date) pyear FROM dbo.purchases where transaction_status=''approved'''
   IF ISNULL(@is_served,'') <> ''
      SET @stmt =@stmt + ' and is_served=''' + @is_served + '''';
   IF ISNULL(@year,0) <> 0
      SET @stmt =@stmt + ' and year(purchase_date)=' + cast(@year AS VARCHAR(20));

   EXEC(@stmt);
END