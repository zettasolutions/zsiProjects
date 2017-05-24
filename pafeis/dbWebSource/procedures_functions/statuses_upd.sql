

create PROCEDURE [dbo].[statuses_upd]
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
		,is_process				= b.is_process
		,is_returned            = b.is_returned
		,is_add                 = b.is_add
		,is_edit                = b.is_edit
		,is_delete              = b.is_delete
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.statuses a INNER JOIN @tt b
    ON a.status_id = b.status_id
    WHERE isnull(b.is_edited,'N') = 'Y' ;

	   
-- Insert Process
    INSERT INTO dbo.statuses (
         status_code 
		,status_name
		,status_color
		,is_item
		,is_aircraft
		,is_process
		,is_returned
		,is_add   
		,is_edit  
		,is_delete
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
	   ,is_process
	   ,is_returned
	   ,is_add   
	   ,is_edit  
	   ,is_delete
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE status_id IS NULL
	and status_name IS NOT NULL;
END



