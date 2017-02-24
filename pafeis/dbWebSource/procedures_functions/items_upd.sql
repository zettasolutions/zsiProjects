

CREATE PROCEDURE [dbo].[items_upd]
(
    @tt    items_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_code_id			= b.item_code_id
	    ,parent_item_id         = b.parent_item_id
		,serial_no				= b.serial_no
		,manufacturer_id		= b.manufacturer_id
		,dealer_id				= b.dealer_id
		,supply_source_id		= b.supply_source_id
		,time_since_new			= b.time_since_new
		,time_before_overhaul	= b.time_before_overhaul
		,time_since_overhaul	= b.time_since_overhaul
		,remaining_time		    = b.remaining_time
		,date_delivered			= b.date_delivered		
		,aircraft_info_id		= b.aircraft_info_id	
		,date_issued			= b.date_issued		
		,status_id				= 23			
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.items a INNER JOIN @tt b
    ON a.item_id = b.item_id
    WHERE ISNULL(b.is_edited,'N')='Y';
	   
-- Insert Process
    INSERT INTO dbo.items (
		 item_code_id
		,parent_item_id
		,serial_no
		,manufacturer_id
		,dealer_id
		,supply_source_id
		,time_since_new
		,time_before_overhaul
		,time_since_overhaul
		,remaining_time
		,date_delivered
		,aircraft_info_id
		,date_issued
		,status_id
        ,created_by
        ,created_date
        )
    SELECT 
		 item_code_id
		,parent_item_id
		,serial_no
		,manufacturer_id
		,dealer_id
		,supply_source_id
		,time_since_new
		,time_before_overhaul
		,time_since_overhaul
		,remaining_time
		,date_delivered
		,aircraft_info_id
		,date_issued
		,23
        ,@user_id
        ,GETDATE()
    FROM @tt
    WHERE item_id IS NULL;
END



 




