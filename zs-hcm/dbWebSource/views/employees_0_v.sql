CREATE VIEW [dbo].[employees_0_v] AS
			  SELECT e.*,concat(last_name,', ',first_name,dbo.isNotNull(middle_name,concat(' ',substring(middle_name,1,1),'.'))) emp_lfm_name
             ,i.inactive_type_desc, p.position_title
		FROM  dbo.employees_0 e LEFT OUTER JOIN
              dbo.positions_0 p on e.position_id = p.position_id LEFT OUTER JOIN 
			  dbo.inactive_types i ON e.inactive_type_code = i.inactive_type_code