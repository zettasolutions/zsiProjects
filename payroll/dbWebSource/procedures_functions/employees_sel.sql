
CREATE PROCEDURE [dbo].[employees_sel]
(
    @id					INT = null
   ,@client_id          INT 
   ,@employee_id		VARCHAR(100) = NULL
   ,@department_id      INT = null
   ,@position_id        INT = null
   ,@user_id			INT = NULL		
   ,@is_active CHAR(1)='Y'	
   ,@search_val nvarchar(100)=null
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
	SET @stmt = 'SELECT * FROM dbo.employees_v WHERE 1=1 ';

	IF ISNULL(@client_id,0) <> 0
	   SET @stmt = @stmt + ' AND client_id=' + CAST(@client_id AS VARCHAR);

	IF ISNULL(@id,0) <> 0
	   SET @stmt = @stmt + ' AND id=' + CAST(@id AS VARCHAR);

	IF ISNULL(@employee_id,'') <> ''
		SET @stmt = @stmt + ' AND employee_id='''+ @employee_id + ''''
    
	IF ISNULL(@department_id,0) <> 0
		SET @stmt = @stmt + ' AND department_id='+ CAST(@department_id AS VARCHAR);
    
	IF ISNULL(@position_id,0) <> 0
		SET @stmt = @stmt + ' AND position_id='+ CAST(@position_id AS VARCHAR);
	IF isnull(@is_active,'') <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';
	
	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND first_name like ''%' + @search_val  + '%'' or last_name like ''%' + @search_val  + '%'''

	set @stmt = @stmt + ' order by employee_id'
	exec(@stmt);
 END;


 


