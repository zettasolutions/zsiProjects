

CREATE PROCEDURE [dbo].[dd_employee_sel] 
(
	@user_id				INT = NULL
)
as
	

begin
	SELECT id, CONCAT(last_name,',' ,' ',middle_name,' ' ,first_name, ' ', name_suffix) AS fullname, last_name, middle_name, first_name, name_suffix FROM dbo.employees WHERE is_active='Y';
end
