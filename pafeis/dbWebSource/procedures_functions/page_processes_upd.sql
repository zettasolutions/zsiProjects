
CREATE PROCEDURE [dbo].[page_processes_upd](
        @tt         page_processes_tt readonly
	   ,@user_id	INT    
)
AS 
BEGIN
SET NOCOUNT ON 

   UPDATE a
          SET page_id		= b.page_id		
			 ,seq_no		= b.seq_no		
			 ,process_desc	= b.process_desc
			 ,role_id		= b.role_id		
			 ,is_active		= b.is_active
			 ,is_default	= b.is_default		
			 ,updated_by	= @user_id	
			 ,updated_date	= GETDATE()
		FROM dbo.page_processes a INNER JOIN @tt b on 
		    a.page_process_id = b.page_process_id 
	     AND ( ISNULL(a.page_id,0) = ISNULL(b.page_id,0)
		   OR  ISNULL(a.seq_no,0) = ISNULL(b.seq_no,0)
		   OR  ISNULL(a.process_desc,'') = ISNULL(b.process_desc,'')
		   OR  ISNULL(a.role_id,0) = ISNULL(b.role_id,0)
		   OR  ISNULL(a.is_active,'') = ISNULL(b.is_active,'')
		   OR  ISNULL(a.is_default,'') = ISNULL(b.is_default,'')
          )
-- INSERT
 INSERT INTO dbo.page_processes (
		page_id		
		,seq_no		
 		,process_desc	
 		,role_id		
 		,is_active	
		,is_default
		,created_by
		,created_date)
 SELECT page_id		
		,seq_no		
 		,process_desc	
 		,role_id		
 		,is_active	
		,is_default
		,@user_id
		,GETDATE()	
	FROM @tt
   WHERE page_process_id IS NULL
	 AND page_id IS NOT NULL
	 AND process_desc IS NOT NULL
	 AND role_id IS NOT NULL
 

END 






