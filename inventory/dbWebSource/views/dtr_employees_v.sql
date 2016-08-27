CREATE VIEW dbo.dtr_employees_v
AS
SELECT        dbo.dtr.dtr_id, dbo.zsi_employees_v.user_id, dbo.zsi_employees_v.full_name, dbo.dtr.time_in, dbo.dtr.time_out
FROM            dbo.dtr LEFT OUTER JOIN
                         dbo.zsi_employees_v ON dbo.dtr.employee_id = dbo.zsi_employees_v.user_id
