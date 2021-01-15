

CREATE FUNCTION [dbo].[getEmpFullName] 
(
	@employee_id			as int
)
RETURNS varchar(50)
AS
BEGIN   
   DECLARE @l_retval   varchar(50);
   SELECT @l_retval =  emp_lfm_name FROM dbo.employees_v where employee_id = @employee_id
   RETURN @l_retval;
END;

