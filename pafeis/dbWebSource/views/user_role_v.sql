CREATE VIEW dbo.user_role_v
AS
SELECT        TOP (100) PERCENT u.user_id, u.logon, u.last_name, u.first_name, u.middle_name, u.password, u.role_id, u.is_active, u.is_admin, u.contact_nos, u.img_filename, u.id_no, u.name_suffix, u.gender, 
                         u.organization_id, u.email_add, u.rank_id, u.civil_status, u.userFullName, u.is_contact, r.role_name, r.is_export_excel, r.is_export_pdf, r.is_import_excel, u.organizationName, u.rankDesc, u.position, 
                         u.is_employee, u.is_zsi, u.position_id
FROM            dbo.users_v AS u LEFT OUTER JOIN
                         dbo.roles AS r ON u.role_id = r.role_id
WHERE        (ISNULL(u.role_id, 0) <> 0)
