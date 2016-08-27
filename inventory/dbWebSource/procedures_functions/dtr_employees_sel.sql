

CREATE PROCEDURE [dbo].[dtr_employees_sel]
(
	 @user_id  int = null
	,@employee_id int = null

)
AS
BEGIN
  DECLARE @stmt		VARCHAR(4000);
  
  SET @stmt = 'SELECT * FROM dbo.dtr_employees_v where isnull(user_id,0) <> 0 ';
  IF @employee_id <> '' 
		SET @stmt = @stmt + 'and user_id='+ CAST(@employee_id AS VARCHAR(50));
   exec (@stmt);
END
 

