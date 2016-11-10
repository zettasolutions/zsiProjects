-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 7, 2016 8:45PM
-- Description:	Insert and update warehouses.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
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
    SET  wing_id				= b.wing_id
		,warehouse_code			= b.warehouse_code
		,warehouse_name			= b.warehouse_name
		,warehouse_full_address  = b.warehouse_full_address
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.warehouses a INNER JOIN @tt b
    ON a.warehouse_id = b.warehouse_id
    WHERE (
			isnull(a.wing_id,0)				    <> isnull(b.wing_id,0)  
		OR	isnull(a.warehouse_code,'')		    <> isnull(b.warehouse_code,'')  
		OR	isnull(a.warehouse_name,'')		    <> isnull(b.warehouse_name,'')   
		OR	isnull(a.warehouse_full_address,'')	<> isnull(b.warehouse_full_address,'')  
		OR	isnull(a.is_active,'')			    <> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO warehouses (
         wing_id 
		,warehouse_code
		,warehouse_name
		,warehouse_full_address
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        wing_id 
	   ,warehouse_code	
	   ,warehouse_name
	   ,warehouse_full_address
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE warehouse_id IS NULL
	and warehouse_code IS NOT NULL;
END
