CREATE VIEW dbo.zsi_employees_v
AS
SELECT        e.employee_id, e.user_id, e.first_name, e.middle_name, e.last_name, e.name_suffix, e.birth_date, e.gender, e.marital_status, e.position_id, e.present_address, 
                         e.provincial_address, e.contact_no, e.email_address, e.emergency_contact_person, e.emergency_contact_no, e.is_active, e.created_by, e.created_date, 
                         e.updated_by, e.updated_date, p.position_name, e.last_name + ', ' + e.first_name + ' ' + ISNULL(e.middle_name, '') AS full_name
FROM            dbo.zsi_employees AS e LEFT OUTER JOIN
                         dbo.position AS p ON e.position_id = p.position_id
