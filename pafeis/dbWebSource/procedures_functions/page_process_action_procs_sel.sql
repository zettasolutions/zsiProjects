

CREATE PROCEDURE [dbo].[page_process_action_procs_sel]
(
    @page_process_action_id  INT = null
)
AS
BEGIN
   SELECT * FROM dbo.page_process_action_procs WHERE page_process_action_id = @page_process_action_id ORDER BY seq_no, proc_name
END
 


