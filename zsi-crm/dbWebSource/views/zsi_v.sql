
CREATE VIEW [dbo].[zsi_v]
AS
SELECT        user_id, logon, last_name, first_name, middle_name, password, role_id, is_active, is_admin, img_filename, name_suffix,  
                         first_name + N' ' + CASE WHEN middle_name IS NULL THEN '' ELSE middle_name END + ' ' + last_name AS userFullName,  role_name
FROM            dbo.users_v
WHERE        (is_developer = 'Y')
