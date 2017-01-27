
CREATE PROCEDURE [dbo].[orgranization_groups_sel]
(
    @is_active CHAR(1) = 'Y'
   ,@col_no   int = 0
   ,@order_no int = 0
)
AS
BEGIN
SET NOCOUNT ON
  DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.organization_groups WHERE is_active=''' + @is_active + '''';


   IF @col_no=0
     SET @stmt = @stmt + ' ORDER BY seq_no '
  ELSE
     SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no AS VARCHAR(20))

  IF @order_no = 0
     SET @stmt = @stmt + ' ASC '
  ELSE
     SET @stmt = @stmt + ' DESC '

  EXEC(@stmt);

END




