


CREATE VIEW [dbo].[employees_v]
AS
SELECT        dbo.employees.*
             ,concat(last_name,', ',first_name,dbo.isNotNull(middle_name,concat(' ',substring(middle_name,1,1),'.'))) emp_lfm_name
             ,dbo.inactive_types.inactive_type_desc
FROM            dbo.employees LEFT OUTER JOIN
                         dbo.inactive_types ON dbo.employees.inactive_type_code = dbo.inactive_types.inactive_type_code



