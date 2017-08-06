
CREATE PROCEDURE [dbo].[sys_requests_upd]
(
    @tt    sys_requests_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  ticket_date		    = b.ticket_date
		,requested_by			= b.requested_by
		,request_desc        	= b.request_desc
		,request_type_id		= b.request_type_id
		,is_urgent				= b.is_urgent
		,status_id				= b.status_id
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.sys_requests a INNER JOIN @tt b
    ON a.ticket_id = b.ticket_id
    WHERE isnull(b.is_edited,'N')='Y'

	   
-- Insert Process
    INSERT INTO dbo.sys_requests (
          ticket_date	
		 ,requested_by		 	
		 ,request_desc   
		 ,request_type_id
		 ,is_urgent	
		 ,status_id			
        ,created_by
        ,created_date
        )
    SELECT 
         ticket_date	
		,requested_by  	
		,request_desc   
		,request_type_id
		,is_urgent		
		,status_id			
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE ticket_id IS NULL
	and request_type_id IS NOT NULL;
END
