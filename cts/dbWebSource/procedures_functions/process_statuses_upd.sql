

Create PROCEDURE [dbo].[process_statuses_upd]
(
    @tt    process_statuses_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process Statuses
    UPDATE a 
    SET  process_id		    = b.process_id
		,status_id		    = b.status_id
		,next_process_id    = b.next_process_id
		,button_text        = b.button_text
		,seq_no  			= b.seq_no
		,is_active          = b.is_active
        ,updated_by			= @user_id
        ,updated_date		= GETDATE()
    FROM dbo.process_statuses a INNER JOIN @tt b
    ON a.process_status_id = b.process_status_id
    WHERE isnull(b.is_edited,'N') = 'Y'
	AND b.process_id IS NOT NULL AND b.status_id IS NOT NULL ;

	   
-- Insert Process
    INSERT INTO dbo.process_statuses (
         process_id 
		,status_id
		,next_process_id
		,button_text    
		,seq_no  
		,is_active  
        ,created_by
        ,created_date
        )
    SELECT 
         process_id 
		,status_id
		,next_process_id
		,button_text    
		,seq_no  
		,is_active  
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE process_status_id IS NULL
	and process_id IS NOT NULL and status_id IS NOT NULL;
END



--[process_statuses_sel]

