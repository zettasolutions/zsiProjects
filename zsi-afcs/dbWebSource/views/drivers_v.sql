CREATE VIEW dbo.drivers_v
AS
SELECT        user_id, company_code, logon, password, role_id, hash_key, position, last_name, first_name, middle_name, name_suffix, full_name, img_filename, is_developer, is_admin, is_active, created_by, created_date, updated_by, 
                         updated_date, company_id
FROM            dbo.users
WHERE        (role_id = 1)
