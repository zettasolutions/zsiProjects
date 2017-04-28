
CREATE PROCEDURE [dbo].[receiving_details_upd]
(
    @tt    receiving_details_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  procurement_detail_id  = b.procurement_detail_id
	    ,item_code_id			= b.item_code_id
		,serial_no				= b.serial_no
		,manufacturer_id        = b.manufacturer_id
		,unit_of_measure_id		= b.unit_of_measure_id
		,quantity				= b.quantity
		,item_class_id			= b.item_class_id
		,time_since_new         = b.time_since_new
		,time_since_overhaul    = b.time_since_overhaul
		,status_id              = b.status_id
		,remarks	            = b.remarks
		,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.receiving_details a INNER JOIN @tt b
    ON a.receiving_detail_id = b.receiving_detail_id
    WHERE ISNULL(b.is_edited,'N')='Y'
  
-- Insert Process
    INSERT INTO dbo.receiving_details (
         receiving_id 
	    ,procurement_detail_id		
	    ,item_code_id
		,serial_no
		,manufacturer_id
		,unit_of_measure_id
		,quantity
		,item_class_id
		,time_since_new
		,time_since_overhaul
		,status_id
		,remarks
		,created_by
        ,created_date
        )
    SELECT 
        receiving_id 
	   ,procurement_detail_id
	   ,item_code_id
	   ,serial_no
	   ,manufacturer_id
	   ,unit_of_measure_id	
	   ,quantity
	   ,item_class_id
	   ,time_since_new
	   ,time_since_overhaul
	   ,status_id
	   ,remarks
	   ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE receiving_detail_id IS NULL
	  AND receiving_id IS NOT NULL
	  AND item_code_id IS NOT NULL
END



