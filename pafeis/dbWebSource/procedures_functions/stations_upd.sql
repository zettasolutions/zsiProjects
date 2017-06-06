



create PROCEDURE [dbo].[stations_upd]
(
    @tt    stations_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  station_code			= b.station_code
		,station_name			= b.station_name
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.stations a INNER JOIN @tt b
    ON a.station_id = b.station_id
    WHERE isnull(b.is_edited,'N') = 'Y'
	   
-- Insert Process
    INSERT INTO dbo.stations (
         station_code
		,station_name
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        station_code	
	   ,station_name
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE station_id IS NULL
	AND station_code IS NOT NULL;
END






