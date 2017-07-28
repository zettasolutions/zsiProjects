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
		,status_id				= b.status_id
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.sys_requests a INNER JOIN @tt b
    ON a.ticket_id = b.ticket_id
    WHERE (
			--	isnull(a.ticket_date,'')			<> isnull(b.ticket_date,'')   
			isnull(a.requested_by,'')			<> isnull(b.requested_by,'')   
			OR	isnull(a.request_desc,'')			<> isnull(b.request_desc,'')  
			OR	isnull(a.request_type_id,'')		<> isnull(b.request_type_id,'')   
			OR	isnull(a.status_id,'')				<> isnull(b.status_id,'')   
			
	   )

	   
-- Insert Process
    INSERT INTO dbo.sys_requests (
          ticket_date	
		 ,requested_by		 	
		 ,request_desc   
		 ,request_type_id
		 ,status_id				
        ,created_by
        ,created_date
        )
    SELECT 
         ticket_date	
		,requested_by  	
		,request_desc   
		,request_type_id
		,status_id		
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE ticket_id IS NULL
	and ticket_date IS NOT NULL;
END



