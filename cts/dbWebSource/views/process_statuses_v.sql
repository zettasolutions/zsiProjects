CREATE VIEW [dbo].[process_statuses_v]
AS
SELECT        dbo.process_statuses.process_status_id, dbo.process_statuses.process_id, dbo.process_statuses.seq_no, dbo.process_statuses.status_id, dbo.process_statuses.button_text, 
                         dbo.process_statuses.next_process_id, dbo.process_statuses.is_active, dbo.processes.client_id, dbo.processes.is_default
FROM            dbo.processes INNER JOIN
                         dbo.process_statuses ON dbo.processes.process_id = dbo.process_statuses.process_id

