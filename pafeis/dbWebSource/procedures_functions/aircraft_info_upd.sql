


CREATE PROCEDURE [dbo].[aircraft_info_upd]
(
    @tt    aircraft_info_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  aircraft_code			= b.aircraft_code
		,aircraft_name			= b.aircraft_name
		,aircraft_type_id		= b.aircraft_type_id
		,squadron_id			= b.squadron_id
		,aircraft_time			= b.aircraft_time
		,service_time           = b.service_time
		,aircraft_source_id		= b.aircraft_source_id
		,aircraft_dealer_id		= b.aircraft_dealer_id
		,status_id				= b.status_id
		,item_class_id          = b.item_class_id
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.aircraft_info a INNER JOIN @tt b
    ON a.aircraft_info_id = b.aircraft_info_id
    WHERE isnull(b.is_edited,'N')='Y'
	   
-- Insert Process
    INSERT INTO dbo.aircraft_info (
         aircraft_code
		,aircraft_name
		,aircraft_type_id
		,squadron_id
		,aircraft_time
		,service_time
		,aircraft_source_id
		,aircraft_dealer_id
		,status_id
		,item_class_id
        ,created_by
        ,created_date
        )
    SELECT 
        aircraft_code
	   ,aircraft_name
	   ,aircraft_type_id
	   ,squadron_id
	   ,aircraft_time
	   ,service_time
	   ,aircraft_source_id
	   ,aircraft_dealer_id
	   ,status_id
	   ,item_class_id
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE aircraft_info_id IS NULL;
END




