CREATE VIEW dbo.zsi_v
AS
SELECT        user_id, logon, last_name, first_name, middle_name, password, role_id, is_active, is_admin, contact_nos, img_filename, id_no, name_suffix, gender, email_add, civil_status, 
                         first_name + N' ' + CASE WHEN middle_name IS NULL THEN '' ELSE middle_name END + ' ' + last_name AS userFullName, is_contact AS is_developer, role_name
FROM            dbo.users_v
WHERE        (is_developer = 'Y')
