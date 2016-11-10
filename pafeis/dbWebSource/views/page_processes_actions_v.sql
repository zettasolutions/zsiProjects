CREATE VIEW dbo.page_processes_actions_v
AS
SELECT        dbo.page_process_actions.page_process_action_id, dbo.page_process_actions.page_process_id, dbo.page_process_actions.seq_no, dbo.page_process_actions.action_desc, 
                         dbo.page_process_actions.status_id, dbo.countPageProcessActionProcs(dbo.page_process_actions.page_process_action_id) AS countPageProcessActionProcs, dbo.page_process_actions.created_by, 
                         dbo.page_process_actions.created_date, dbo.page_process_actions.updated_by, dbo.page_process_actions.updated_date, dbo.page_processes.page_id
FROM            dbo.page_process_actions INNER JOIN
                         dbo.page_processes ON dbo.page_process_actions.page_process_id = dbo.page_processes.page_process_id
