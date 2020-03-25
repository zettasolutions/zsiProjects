CREATE PROCEDURE [dbo].[departments_sel] 
(
	 @department_id		INT = NULL
	,@department_code	VARCHAR(20)= NULL
	,@department_name	VARCHAR(50)= NULL
	,@is_active			VARCHAR(1)='Y'
)
as
	

begin
DECLARE @stmt		VARCHAR(4000);
	SET @stmt = 'SELECT * FROM dbo.departments WHERE 1=1';

IF @department_id <> '' 
	SET @stmt = @stmt + ' AND @department_id' + CAST(@department_id AS VARCHAR);

IF @department_code <> ''
	SET @stmt = @stmt + ' AND @department_code'+ @department_code;
    
IF @department_name <> ''
	SET @stmt = @stmt + ' AND @department_name'+ @department_name;
IF @is_active <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';

set @stmt = @stmt + ' order by department_code'
	exec(@stmt);
end
