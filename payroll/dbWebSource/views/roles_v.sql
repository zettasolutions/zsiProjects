CREATE VIEW dbo.roles_v
AS
SELECT        created_by, created_date, updated_by, updated_date, role_id, role_name, is_export_excel, is_export_pdf, is_import_excel, dbo.countRoleMenus(role_id) AS countRoleMenus, dbo.countUsers(role_id) 
                         AS countUsers, dbo.countRoleDashboards(role_id) AS countRoleDashboards, is_add, is_edit, is_delete
FROM            dbo.roles
