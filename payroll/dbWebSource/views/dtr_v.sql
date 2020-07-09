CREATE VIEW dbo.dtr_v
AS
SELECT dbo.dtr.*, dbo.employees_v.client_id, dbo.employees_v.employee_no, dbo.employees_v.emp_lfm_name
FROM     dbo.dtr INNER JOIN
                  dbo.employees_v ON dbo.dtr.employee_id = dbo.employees_v.id
