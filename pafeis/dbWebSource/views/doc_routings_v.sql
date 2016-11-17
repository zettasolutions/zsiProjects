CREATE VIEW dbo.doc_routings_v
AS
SELECT        dbo.doc_routings.*, dbo.page_processes.process_desc, dbo.page_process_actions.action_desc, dbo.getStatus(dbo.page_process_actions.status_id) AS status
FROM            dbo.doc_routings INNER JOIN
                         dbo.page_processes ON dbo.doc_routings.page_process_id = dbo.page_processes.page_process_id LEFT OUTER JOIN
                         dbo.page_process_actions ON dbo.doc_routings.page_process_action_id = dbo.page_process_actions.page_process_action_id
