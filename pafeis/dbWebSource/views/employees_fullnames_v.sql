CREATE VIEW dbo.employees_fullnames_v
AS
SELECT        employee_id, last_name + ', ' + first_name AS full_name
FROM            dbo.employees
