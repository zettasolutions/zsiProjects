
CREATE PROCEDURE [dbo].[employees_sel]
(
    @id					INT = null
   ,@client_id          INT = 0
   ,@employee_id		VARCHAR(100) = NULL
   ,@department_id      INT = null
   ,@position_id        INT = null
   ,@user_id			INT = NULL		
   ,@is_active CHAR(1)='Y'	
   ,@search_val nvarchar(100)=null
   ,@col_no           int=1
   ,@order_no         int=0

)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
	DECLARE @tbl_employees  NVARCHAR(100) = CONCAT('dbo.employees_',@client_id)
    IF isnull(@is_active,'N') = 'Y'
	   SET @stmt = CONCAT('SELECT ',@tbl_employees,'.*, CONVERT(varchar(max),ei.file_content,2) image FROM ',@tbl_employees,' LEFT JOIN dbo.employee_images AS ei ON ',@tbl_employees,'.id = ei.id  WHERE is_active=''Y''');
    ELSE
	   SET @stmt = CONCAT('SELECT ',@tbl_employees,'.*, CONVERT(varchar(max),ei.file_content,2) image FROM ',@tbl_employees,' LEFT JOIN dbo.employee_images AS ei ON ',@tbl_employees,'.id = ei.id  WHERE is_active=''N''');

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

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND cast(employee_no as varchar(20)) like ''%' + @search_val  + '%'' or first_name like ''%' + @search_val  + '%'' or last_name like ''%' + @search_val  + '%'''

	SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no as varchar(20))

	IF isnull(@order_no,0) = 0
	   SET @stmt = @stmt + ' ASC'
     ELSE
	   SET @stmt = @stmt + ' DESC'

	exec(@stmt);
 END;



 --SELECT dbo.employees_0.*, CONVERT(varchar(max),ei.file_content,2) image FROM dbo.employees_0 LEFT JOIN dbo.employee_images AS ei ON dbo.employees_0.id = ei.id  WHERE is_active='Y'