
CREATE PROCEDURE [dbo].[organizations_sel]
(
  @col_no   int = 1
 ,@order_no int = 0
 ,@is_active char(1)='Y'
 ,@organization_id INT = NULL
 ,@level_no  int = 1

)
AS
BEGIN
  DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.organizations_v WHERE level_no = ' + cast(@level_no as varchar(20)) + ' AND is_active=''' + @is_active + '''';


  IF ISNULL(@organization_id,0) <> 0
     SET @stmt = @stmt + ' AND organization_pid=' + cast(@organization_id AS VARCHAR(20))

  SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no AS VARCHAR(20))
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC '
  ELSE
     SET @stmt = @stmt + ' DESC '

  EXEC(@stmt);
END


