CREATE PROCEDURE [dbo].[dd_departments_sel] 
(
	 @client_id             INT
	,@is_active				VARCHAR(1)='Y'
	,@user_id				INT = NULL
)
as
	

begin
DECLARE @stmt		VARCHAR(4000);
	SET @stmt = 'SELECT * FROM dbo.dept_sect_' + CAST(@client_id AS VARCHAR(20)) + '  WHERE ISNULL(dept_sect_parent_id,0)=0';
IF @is_active <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';

set @stmt = @stmt + ' order by dept_sect_code'
	exec(@stmt);
end