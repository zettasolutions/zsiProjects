
CREATE PROCEDURE [dbo].[current_process_actions_sel]
(
   @page_id INT
  ,@doc_id  INT = NULL
  ,@user_id INT
)
AS
BEGIN
  DECLARE @role_id  int
  SELECT @role_id=role_id FROM users WHERE user_id=@user_id;


  IF ISNULL(@doc_id,0) = 0
	  SELECT * FROM dbo.page_process_action_roles_v 
	   WHERE page_id=@page_id AND role_id=@role_id
		 AND is_default='Y'
  ELSE
      SELECT * FROM dbo.page_process_action_roles_v WHERE role_id=@role_id and  page_process_id = (SELECT page_process_id FROM doc_routings_v 
	  WHERE page_id=@page_id AND role_id=@role_id and is_current='Y' and doc_id=@doc_id)

END


