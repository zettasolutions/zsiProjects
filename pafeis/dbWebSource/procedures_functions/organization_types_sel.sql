
CREATE PROCEDURE [dbo].[organization_types_sel]
(
  @col_no   int = 1
 ,@order_no int = 0
 ,@is_active char(1)='Y'
 ,@level_no int = null

)
AS
BEGIN
  DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.organization_types WHERE is_active=''' + @is_active + '''';

  IF ISNULL(@level_no,0) <> 0
     SET @stmt = @stmt + ' AND level_no = ' + cast(@level_no as varchar(20))

  SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no AS VARCHAR(20))
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC '
  ELSE
     SET @stmt = @stmt + ' DESC '
 
  EXEC(@stmt)
END

