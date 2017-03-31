
CREATE VIEW [dbo].[employees_v]
AS
SELECT        user_id, logon, last_name, first_name, middle_name, password, role_id, is_active, is_admin, contact_nos, img_filename, id_no, name_suffix, gender, organization_id, email_add, rank_id, civil_status, 
                         first_name + N' ' + CASE WHEN middle_name IS NULL THEN '' ELSE middle_name END + ' ' + last_name AS userFullName, is_contact, dbo.getOrganizationName(organization_id) AS organizationName, 
                         dbo.getRankDesc(rank_id) AS rankDesc, dbo.getPositionDesc(position_id) AS position, position_id, is_employee, is_zsi, warehouse_id, dbo.getWarehouseLocation(warehouse_id) AS warehouse_location
FROM            dbo.users
WHERE        (is_employee = 'Y') 
