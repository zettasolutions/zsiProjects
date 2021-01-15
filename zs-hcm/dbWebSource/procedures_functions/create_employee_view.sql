
CREATE PROCEDURE [dbo].[create_employee_view]
  (@client_id INT) 
AS
BEGIN
   DECLARE @stmt nvarchar(max)
   SET @stmt =CONCAT('CREATE VIEW [dbo].[employees_',@client_id,'_v] AS
			  SELECT e.*,concat(last_name,'', '',first_name,dbo.isNotNull(middle_name,concat('' '',substring(middle_name,1,1),''.''))) emp_lfm_name
             ,i.inactive_type_desc, p.position_title
		FROM  dbo.employees_',@client_id,' e LEFT OUTER JOIN
              dbo.positions_',@client_id,' p on e.position_id = p.position_id LEFT OUTER JOIN 
			  dbo.inactive_types i ON e.inactive_type_code = i.inactive_type_code')
	
EXEC(@stmt);	
END;
