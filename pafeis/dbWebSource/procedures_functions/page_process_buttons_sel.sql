

CREATE PROCEDURE [dbo].[page_process_buttons_sel]
(
    @page_process_action_id  INT = null
)
AS
BEGIN
   SELECT * FROM dbo.page_process_actions_v WHERE page_process_id = (select page_process_id FROM page_process_actions where page_process_action_id=@page_process_action_id) ORDER BY seq_no, action_desc
END
 


