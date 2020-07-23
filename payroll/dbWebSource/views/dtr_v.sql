CREATE VIEW dbo.dtr_v
AS
SELECT dbo.dtr.id, dbo.dtr.employee_id, dbo.dtr.shift_id, dbo.dtr.shift_hours, dbo.dtr.dtr_date, dbo.dtr.dt_in, dbo.dtr.dt_out, dbo.dtr.reg_hours, dbo.dtr.nd_hours, dbo.dtr.odt_in, dbo.dtr.odt_out, dbo.dtr.reg_ot_hrs, dbo.dtr.nd_ot_hours, 
                  dbo.dtr.rd_ot_hours, dbo.dtr.rhd_ot_hours, dbo.dtr.shd_ot_hours, dbo.dtr.leave_type_id, dbo.dtr.leave_hours, dbo.dtr.leave_hours_wpay, dbo.employees_v.client_id, dbo.employees_v.employee_no, dbo.employees_v.emp_lfm_name, 
                  dbo.employees_v.last_name, dbo.employees_v.first_name, dbo.employees_v.middle_name, dbo.employees_v.name_suffix
FROM     dbo.dtr INNER JOIN
                  dbo.employees_v ON dbo.dtr.employee_id = dbo.employees_v.id
