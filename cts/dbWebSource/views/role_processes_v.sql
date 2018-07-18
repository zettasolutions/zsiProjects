CREATE VIEW dbo.role_processes_v
AS
SELECT        dbo.processes.seq_no, dbo.processes.process_title, dbo.processes.icon, dbo.role_processes.role_id, dbo.role_processes.is_edit, dbo.role_processes.is_delete, dbo.processes.process_id, 
                         dbo.processes.created_by, dbo.processes.client_id
FROM            dbo.processes INNER JOIN
                         dbo.role_processes ON dbo.processes.process_id = dbo.role_processes.process_id
