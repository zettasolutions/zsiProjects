

CREATE PROCEDURE [dbo].[page_process_actions_sel]
(
    @page_process_id  INT = null
)
AS
BEGIN
   SELECT * FROM dbo.page_processes_actions_v WHERE page_process_id = @page_process_id ORDER BY seq_no, action_desc
END
 


