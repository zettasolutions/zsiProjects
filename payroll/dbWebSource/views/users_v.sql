
CREATE VIEW [dbo].[users_v]
AS
SELECT        dbo.users.user_id, dbo.users.logon, dbo.users.last_name, dbo.users.first_name, dbo.users.middle_name, dbo.users.password, dbo.users.role_id, dbo.users.is_active, dbo.users.is_admin, 
                         dbo.users.contact_nos, dbo.users.img_filename, dbo.users.id_no, dbo.users.name_suffix, dbo.users.gender, dbo.users.organization_id, dbo.users.email_add, dbo.users.rank_id, dbo.users.civil_status, 
                         dbo.users.first_name + N' ' + CASE WHEN middle_name IS NULL THEN '' ELSE middle_name END + ' ' + dbo.users.last_name AS userFullName, dbo.users.is_contact, 
                         dbo.getPositionDesc(dbo.users.position_id) AS position, dbo.users.position_id, 
                         dbo.users.is_employee, dbo.users.is_zsi, 
                         dbo.users.last_name + N',' + dbo.users.first_name AS last_first_name
FROM            dbo.users 
WHERE        (dbo.users.is_employee = 'Y') AND (dbo.users.logon IS NOT NULL)

