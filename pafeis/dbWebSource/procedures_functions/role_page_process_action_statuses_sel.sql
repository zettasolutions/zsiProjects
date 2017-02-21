
CREATE PROCEDURE [dbo].[role_page_process_action_statuses_sel]
(
   @page_id INT
  ,@role_id INT
)
AS
BEGIN
  SELECT dbo.getStatusByPageProcessActionId(page_process_action_id) FROM dbo.page_process_actions_v 
   WHERE page_id=@page_id AND role_id=@role_id ORDER BY seq_no

END


