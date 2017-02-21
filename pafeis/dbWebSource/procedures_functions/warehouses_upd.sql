-- ===================================================================================================
CREATE PROCEDURE [dbo].[warehouses_upd]
(
    @tt    warehouses_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  squadron_id			= b.squadron_id
		,warehouse_code			= b.warehouse_code
		,warehouse_location		= b.warehouse_location
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.warehouses a INNER JOIN @tt b
    ON a.warehouse_id = b.warehouse_id
    WHERE isnull(b.is_edited,'N')='Y';
	   
-- Insert Process
    INSERT INTO warehouses (
         squadron_id 
		,warehouse_code
		,warehouse_location
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        squadron_id 
	   ,warehouse_code	
	   ,warehouse_location
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE warehouse_id IS NULL
	and warehouse_code IS NOT NULL
	and warehouse_location IS NOT NULL;
END
