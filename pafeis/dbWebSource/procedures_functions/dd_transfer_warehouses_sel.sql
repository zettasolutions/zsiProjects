CREATE PROCEDURE [dbo].[dd_transfer_warehouses_sel]
(
    @user_id	    INT = null 
   ,@type_name      NVARCHAR(50)=null
   ,@is_active      CHAR(1) = 'Y'
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
DECLARE @wing_id NVARCHAR(10);
DECLARE @organization_id int;
DECLARE @warehouse_id NVARCHAR(10);
DECLARE @organization_type_code varchar(20);

  SET @stmt = 'SELECT * FROM dbo.warehouses_v WHERE is_active = ''' + @is_active + ''''

  SELECT @organization_type_code=organization_type_code, @organization_id = organization_id FROM dbo.organizations_v where organization_id = dbo.getUserOrganizationId(@user_id)


  IF @organization_type_code <> 'WING'
  BEGIN
     SET @wing_id = cast(dbo.getWingId(dbo.getUserOrganizationId(@user_id)) as varchar(20)) 
	 SET @warehouse_id =  CAST(dbo.getUserWarehouseId(@user_id) as varchar(20))
	 IF ISNULL(@warehouse_id,'') <> ''
	    SET @stmt = @stmt + ' AND warehouse_id <> ' + @warehouse_id
  END
  ELSE 
     SET @wing_id = cast(dbo.getUserOrganizationId(@user_id) as varchar(20)) 

  IF @type_name = 'DIRECTIVE'
     SET @stmt = @stmt + ' AND wing_id <> ' + @wing_id
  ELSE
     SET @stmt = @stmt + ' AND wing_id = ' + @wing_id

  EXEC(@stmt)
END