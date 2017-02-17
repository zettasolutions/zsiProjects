CREATE PROCEDURE [dbo].[dd_transfer_warehouses_sel]
(
    @user_id	    INT = null
   ,@is_active      CHAR(1) = 'Y'

)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)

  SET @stmt = 'SELECT * FROM dbo.warehouses_v WHERE is_active = ''' + @is_active + ''''
  SET @stmt = @stmt + ' AND warehouse_id <> ' + CAST(dbo.getUserWarehouseId(@user_id) as varchar(20))
  
	 
  EXEC(@stmt)
END

