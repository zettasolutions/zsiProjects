

 CREATE PROCEDURE [dbo].[page_process_roles_upd](
  @tt        page_process_roles_tt readonly
 ,@user_id	INT    
)
AS 
BEGIN
SET NOCOUNT ON 

   UPDATE a
          SET role_id           = b.role_id
		FROM dbo.page_process_roles a INNER JOIN @tt b on 
		    a.page_process_role_id = b.page_process_role_id 
		WHERE ISNULl(b.is_edited,'N')='Y'

-- INSERT
 INSERT INTO dbo.page_process_roles (
		page_process_id	
		,role_id		)
 SELECT page_process_id	
        ,role_id
	FROM @tt
   WHERE page_process_role_id IS NULL
	 AND page_process_id IS NOT NULL
	 AND role_id IS NOT NULL
END 








