
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
  SET NOCOUNT ON
  DECLARE @stmt NVARCHAR(MAX)
  DECLARE @tt AS TABLE (
    level_no int
)
  DECLARE @ctr int = 0
  DECLARE @rec int = 0
  DECLARE @clevel_no int = @level_no
  SET @stmt = 'SELECT organization_id, organization_type_id, organization_pid, level_no, organization_code, organization_name, organization_head_id, organization_address ' 
  
  INSERT INTO @tt SELECT level_no FROM organization_types WHERE level_no > @level_no order by level_no
  SELECT @rec = COUNT(*) FROM @tt 
   WHILE @ctr < @rec 
   BEGIN	
		SELECT TOP 1 @clevel_no = level_no FROM @tt WHERE level_no > @clevel_no
		SET @stmt = @stmt + ', IIF(ISNULL(organization_id,0)=0,'''',''<a href=''''javascript:void(0);'''' onclick=''''myFunction(' + cast(@clevel_no as varchar(20)) + ',' + '"' + ''' + organization_name + ''' + '"' +','' + cast(organization_id as varchar(20)) + '');''''>'' + cast(dbo.countSubOrganizations(organization_id,' + cast(@clevel_no as varchar(20)) + ')as varchar(20)) + ''</a>'') as subOrganization' + cast(@clevel_no as varchar(20))
        SET @ctr = @ctr + 1
   END	
    
  SET @stmt = @stmt + ', organization_group_id,squadron_type_id , dbo.countWarehouses(organization_id) as warehouseCount, is_active FROM dbo.organizations_v WHERE level_no = ' + cast(@level_no as varchar(20)) + ' AND is_active=''' + @is_active + '''';


  IF ISNULL(@organization_id,0) <> 0
     SET @stmt = @stmt + ' AND organization_pid=' + cast(@organization_id AS VARCHAR(20))

  SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no AS VARCHAR(20))
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC '
  ELSE
     SET @stmt = @stmt + ' DESC '

  print @stmt;
  EXEC(@stmt);
END


