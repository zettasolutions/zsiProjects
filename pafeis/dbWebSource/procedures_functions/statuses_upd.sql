
CREATE PROCEDURE [dbo].[statuses_upd]
(
    @tt    statuses_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  status_code		    = b.status_code
		,status_name			= b.status_name
		,status_color  			= b.status_color
		,is_item        		= b.is_item
		,is_aircraft		    = b.is_aircraft
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.statuses a INNER JOIN @tt b
    ON a.status_id = b.status_id
    WHERE (
			isnull(a.status_code,'')		<> isnull(b.status_code,'')  
		OR	isnull(a.status_name,'')		<> isnull(b.status_name,'')  
		OR	isnull(a.status_color,'')		<> isnull(b.status_color,'')   
		OR	isnull(a.is_item,'')	        <> isnull(b.is_item,'')   
		OR	isnull(a.is_aircraft,'')		<> isnull(b.is_aircraft,'')  
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.statuses (
         status_code 
		,status_name
		,status_color
		,is_item
		,is_aircraft
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        status_code 
	   ,status_name	
	   ,status_color
	   ,is_item
	   ,is_aircraft
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE status_id IS NULL;
END

