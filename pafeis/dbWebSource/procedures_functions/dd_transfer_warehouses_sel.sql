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
DECLARE @wing_id INT;

 

  SET @stmt = 'SELECT * FROM dbo.warehouses_v WHERE is_active = ''' + @is_active + ''''

  IF @type_name = 'DIRECTIVE'
     SET @stmt = @stmt + ' AND wing_id <> ' + cast(dbo.getWingId(dbo.getUserOrganizationId(@user_id)) as varchar(20)) 
  ELSE
     SET @stmt = @stmt + ' AND wing_id = ' + cast(dbo.getWingId(dbo.getUserOrganizationId(@user_id)) as varchar(20)) --+ ' AND squadron_type=''' + @type_name + ''''
 

  SET @stmt = @stmt + ' AND warehouse_id <> ' + CAST(dbo.getUserWarehouseId(@user_id) as varchar(20))
  
	 
  EXEC(@stmt)
END