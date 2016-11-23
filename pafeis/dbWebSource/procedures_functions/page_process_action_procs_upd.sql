
 CREATE PROCEDURE [dbo].[page_process_action_procs_upd](
  @tt        page_process_action_procs_tt readonly
 ,@user_id	INT    
)
AS 
BEGIN
SET NOCOUNT ON 

   UPDATE a
          SET page_process_action_id	= b.page_process_action_id		
		     ,seq_no            = b.seq_no
			 ,proc_name	        = b.proc_name
			 ,class_container   = b.class_container
			 ,updated_by	    = @user_id	
			 ,updated_date	    = GETDATE()
		FROM dbo.page_process_action_procs a INNER JOIN @tt b on 
		    a.page_process_action_proc_id = b.page_process_action_proc_id 
	     AND ( ISNULL(a.page_process_action_id,0) = ISNULL(b.page_process_action_id,0)
		   OR  ISNULL(a.seq_no,0) = ISNULL(b.seq_no,0)
		   OR  ISNULL(a.proc_name,'') = ISNULL(b.proc_name,'')
          )
-- INSERT
 INSERT INTO dbo.page_process_action_procs (
		page_process_action_id	
		,seq_no		
 		,proc_name	
		,class_container
		,created_by
		,created_date)
 SELECT page_process_action_id	
        ,seq_no	
 		,proc_name	
		,class_container
		,@user_id
		,GETDATE()	
	FROM @tt
   WHERE page_process_action_proc_id IS NULL
	 AND page_process_action_id IS NOT NULL
	 AND proc_name IS NOT NULL

END 







