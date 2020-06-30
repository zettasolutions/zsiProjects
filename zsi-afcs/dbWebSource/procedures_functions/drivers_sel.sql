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
	DECLARE @count INT = 0;
	DECLARE @order          VARCHAR(4000);
	DECLARE @page_count INT = 1;
	DECLARE @company_id nvarchar(20)=null
	DECLARE @stmt nvarchar(max)='';
		select @company_id = company_id FROM dbo.users where user_id=@user_id;
		SET @stmt = 'SELECT * FROM dbo.drivers_v WHERE company_id = ''' + @company_id + '''';
		SET @order = ' ORDER BY ' + CAST(@col_no + 1 AS VARCHAR(1)) + ' ' + IIF(@order_no=0,'ASC','DESC');  
		SELECT @count = COUNT(*) FROM dbo.users_v WHERE is_active = @is_active;
IF isnull(@searchVal,'') <>''
BEGIN
	  SET @stmt = @stmt + ' AND first_name like ''%'+@searchVal+'%'' or last_name like ''%'+@searchVal+'%''';
	  SELECT @count = COUNT(*) FROM dbo.users_v WHERE is_active = @is_active + ' AND  first_name like ''%'+@searchVal+'%'' or last_name like ''%'+@searchVal+'%''';
END		
	SET @stmt = @stmt + @order
	SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY ';
	EXEC(@stmt);

	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);
	print 'rpp:' +  CAST(@page_count AS VARCHAR(20))
	RETURN @page_count;
END


