
CREATE VIEW [dbo].[users_v]
AS
SELECT        first_name + N' ' + CASE WHEN middle_name IS NULL THEN '' ELSE middle_name END + ' ' + last_name AS userFullName, last_name + N',' + first_name AS last_first_name, user_id, user_id as app_user_id,  client_id, is_developer, last_name, 
                         first_name, middle_name, name_suffix, email_add, landline_no, mobile_no1, mobile_no2, img_filename, logon, password, is_add, is_active, is_admin, created_by, created_date, updated_by, updated_date, 
                         last_activity_dt
FROM            dbo.users

