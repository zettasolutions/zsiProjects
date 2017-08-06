CREATE PROCEDURE [dbo].[dd_warehouses_sel]
(
    @user_id	    INT = null
   ,@squadron_id    int = null
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @count INT=0
  IF ISNULL(@squadron_id,0) <> 0
     SELECT warehouse_id, warehouse_location as warehouse FROM dbo.warehouses_v where squadron_id=@squadron_id ORDER BY warehouse_location
  else
  BEGIN
	  SELECT @count = count(*) FROM dbo.warehouses where squadron_id = dbo.getUserOrganizationId(@user_id)
	  IF @count = 0
		 SELECT warehouse_id, organization_warehouse as warehouse FROM dbo.user_warehouses(@user_id) order by warehouse_location
	  ELSE 
		 SELECT warehouse_id, warehouse_location as warehouse FROM dbo.user_warehouses(@user_id) order by warehouse_location
   END
END

