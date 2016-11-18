
 CREATE PROCEDURE [dbo].[page_process_actions_upd](
  @tt        page_process_actions_tt readonly
 ,@user_id	INT    
)
AS 
BEGIN
SET NOCOUNT ON 

   UPDATE a
          SET page_process_id	= b.page_process_id		
		     ,seq_no            = b.seq_no
			 ,action_desc	    = b.action_desc
			 ,status_id		    = b.status_id			
			 ,next_process_id	= b.next_process_id
			 ,updated_by	    = @user_id	
			 ,updated_date	    = GETDATE()
		FROM dbo.page_process_actions a INNER JOIN @tt b on 
		    a.page_process_action_id = b.page_process_action_id 
	     AND ( ISNULL(a.page_process_id,0) = ISNULL(b.page_process_id,0)
		   OR  ISNULL(a.seq_no,0) = ISNULL(b.seq_no,0)
		   OR  ISNULL(a.action_desc,'') = ISNULL(b.action_desc,'')
		   OR  ISNULL(a.status_id,0) = ISNULL(b.status_id,0)
		   OR  ISNULL(a.next_process_id,0) = ISNULL(b.next_process_id,0)
          )
-- INSERT
 INSERT INTO dbo.page_process_actions (
		page_process_id	
		,seq_no		
 		,action_desc	
 		,status_id
		,next_process_id		
		,created_by
		,created_date)
 SELECT page_process_id	
        ,seq_no	
 		,action_desc	
 		,status_id		
		,next_process_id
		,@user_id
		,GETDATE()	
	FROM @tt
   WHERE page_process_action_id IS NULL
	 AND page_process_id IS NOT NULL
	 AND action_desc IS NOT NULL

END 







