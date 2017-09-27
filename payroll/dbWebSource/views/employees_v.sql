CREATE VIEW dbo.employees_v
AS
SELECT        user_id, id_no, last_name, first_name, middle_name, logon, password, role_id, is_active, is_admin, contact_nos, img_filename, name_suffix, gender, organization_id, email_add, civil_status, 
                         first_name + N' ' + CASE WHEN middle_name IS NULL THEN '' ELSE middle_name END + ' ' + last_name AS userFullName, is_contact, dbo.getPositionDesc(position_id) AS position, position_id, is_employee, is_zsi
FROM            dbo.users
WHERE        (is_employee = 'Y')
