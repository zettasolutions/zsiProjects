CREATE PROCEDURE [dbo].[emp_pos_other_income_sel] 
(
	@position_id int=null
   ,@employee_id int=null
   ,@user_id INT=null
)
as
begin
set nocount on
   IF isnull(@position_id,0)<>0
     select * from dbo.emp_pos_other_income where position_id = @position_id order by other_income_id;
   
   IF isnull(@employee_id,0)<>0
     select * from dbo.emp_pos_other_income where employee_id = @employee_id order by other_income_id;
   

end
