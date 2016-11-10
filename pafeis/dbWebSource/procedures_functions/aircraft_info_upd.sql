


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
		,aircraft_source_id		= b.aircraft_source_id
		,aircraft_dealer_id		= b.aircraft_dealer_id
		,status_id				= b.status_id
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.aircraft_info a INNER JOIN @tt b
    ON a.aircraft_info_id = b.aircraft_info_id
    WHERE (
			isnull(a.aircraft_code,'')		<> isnull(b.aircraft_code,'')  
		OR	isnull(a.aircraft_name,'')		<> isnull(b.aircraft_name,'')  
		OR	isnull(a.aircraft_type_id,0)	<> isnull(b.aircraft_type_id,0) 
		OR	isnull(a.squadron_id,0)		<> isnull(b.squadron_id,0) 
		OR	isnull(a.aircraft_time,0)		<> isnull(b.aircraft_time,0) 
		OR	isnull(a.aircraft_source_id,0)	<> isnull(b.aircraft_source_id,0) 
		OR	isnull(a.aircraft_dealer_id,0)	<> isnull(b.aircraft_dealer_id,0) 
		OR	isnull(a.status_id,0)			<> isnull(b.status_id,0) 
	)
	   
-- Insert Process
    INSERT INTO dbo.aircraft_info (
         aircraft_code
		,aircraft_name
		,aircraft_type_id
		,squadron_id
		,aircraft_time
		,aircraft_source_id
		,aircraft_dealer_id
		,status_id
        ,created_by
        ,created_date
        )
    SELECT 
        aircraft_code
	   ,aircraft_name
	   ,aircraft_type_id
	   ,squadron_id
	   ,aircraft_time
	   ,aircraft_source_id
	   ,aircraft_dealer_id
	   ,status_id
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE aircraft_info_id IS NULL;
END

