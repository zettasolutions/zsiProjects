
CREATE PROCEDURE [dbo].[dept_sect_sel] 
(
	 @dept_sect_id			INT = NULL
	,@dept_sect_code		VARCHAR(20)= NULL
	,@dept_sect_name		VARCHAR(50)= NULL
	,@dept_sect_parent_id	INT = NULL
	,@is_active				VARCHAR(1)='Y'
	,@user_id				INT = NULL
)
as
	

begin
DECLARE @stmt		VARCHAR(4000);
	SET @stmt = 'SELECT * FROM dbo.dept_sect WHERE 1=1';

IF @dept_sect_id <> '' 
	SET @stmt = @stmt + ' AND dept_sect_id=' + CAST(@dept_sect_id AS VARCHAR);

IF @dept_sect_code <> ''
	SET @stmt = @stmt + ' AND dept_sect_code='+ @dept_sect_code;
    
IF @dept_sect_name <> ''
	SET @stmt = @stmt + ' AND dept_sect_name='+ @dept_sect_name;

IF @dept_sect_parent_id <> '' 
	SET @stmt = @stmt + ' AND dept_sect_parent_id=' + CAST(@dept_sect_parent_id AS VARCHAR);


IF @is_active <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';

set @stmt = @stmt + ' order by dept_sect_code'
	exec(@stmt);
end

