CREATE VIEW dbo.user_role_processes_v
AS
SELECT        dbo.role_processes.process_id, dbo.user_roles.user_id AS app_user_id, dbo.user_roles.role_id, dbo.role_processes.is_edit, dbo.role_processes.is_delete
FROM            dbo.user_roles INNER JOIN
                         dbo.role_processes ON dbo.user_roles.role_id = dbo.role_processes.role_id
