CREATE PROCEDURE [dbo].[drivers_sel]
(
    @user_id  int = null
   ,@is_active varchar(1)='Y'
   ,@pno INT = 1
   ,@rpp INT = 1000
   ,@col_no INT = 3
   ,@order_no INT = 0
   ,@searchVal VARCHAR(50) = null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @order          VARCHAR(4000);
	DECLARE @company_id nvarchar(20)=null
	DECLARE @stmt nvarchar(max)='';
		select @company_id = company_id FROM dbo.users where user_id=@user_id;
		SET @stmt = 'SELECT * FROM zsi_payroll.dbo.drivers_active_v WHERE client_id = ''' + @company_id + '''';
		SET @order = ' ORDER BY ' + CAST(@col_no + 1 AS VARCHAR(1)) + ' ' + IIF(@order_no=0,'ASC','DESC');  
	IF isnull(@searchVal,'') <>''
	   SET @stmt = @stmt + ' AND first_name like ''%'+@searchVal+'%'' or last_name like ''%'+@searchVal+'%''';
	
	SET @stmt = @stmt + @order
	EXEC(@stmt);

END


