CREATE PROCEDURE report_hdr (
 @wing_id		int=null
,@squadron_id	int=null
,@warehouse_id  int=null
)
as
BEGIN
DECLARE @stmt nvarchar(max);
DECLARE @wing_name nvarchar(50);
	   SET @stmt = 'SELECT dbo.getWarehouseLocation(' + CAST(@warehouse_id AS varchar(20)) + ') warehouse '
       SET @stmt = @stmt + ',dbo.getOrganizationName(' + CAST(@squadron_id AS varchar(20)) + ') squadron '
	   IF ISNULL(@wing_id,0) <> 0
	      SET @wing_name = dbo.getOrganizationName(@wing_id) 
	   ELSE
	      SELECT @wing_name = organization_name from dbo.org_parent(@squadron_id) where organization_type_id=2;
	   
	   SET @stmt = @stmt + ',''' + @wing_name + ''' wing '
	   --print @stmt;
      EXEC(@stmt);
END;  


