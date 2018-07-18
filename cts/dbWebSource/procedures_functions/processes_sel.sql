



CREATE PROCEDURE [dbo].[processes_sel](
  @is_active CHAR(1) = 'Y'
 ,@sort_index INT=1
 ,@sort_order INT=0
 ,@rpp        INT=25
 ,@pno        INT= 1
 ,@user_id    INT
)

AS
BEGIN

	SET NOCOUNT ON
	DECLARE @stmt         NVARCHAR(MAX)
	DECLARE @order        NVARCHAR(20) = ' ASC'
	DECLARE @stmt2        NVARCHAR(MAX)
	DECLARE @count		  INT = 0
	DECLARE @result_param NVARCHAR(500)
	DECLARE @page_count	  INT = 1
	DECLARE @client_id    INT

	SELECT @client_id=client_id FROM dbo.users WHERE user_id=@user_id;

	IF @sort_order = 1
	   SET @order = ' DESC'

	SET @stmt = 'SELECT *, dbo.countProcessStatuses(process_id) countProcessStatuses FROM dbo.processes WHERE client_id=' + CAST(@client_id AS VARCHAR(20)) + ' AND is_active=''' + @is_active + '''';
	SET @stmt2 = N'SELECT @result = COUNT(*) FROM dbo.processes WHERE client_id=' + CAST(@client_id AS VARCHAR(20)) + ' AND is_active=''' + @is_active + '''';
	SET @result_param = N'@result varchar(30) OUTPUT';
	EXECUTE sp_executesql @stmt2, @result_param, @result=@Count OUTPUT;

	SET @stmt = @stmt +  ' ORDER BY ' + cast(@sort_index as varchar(20)) + @order;
	SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY '; 
	
	EXEC(@stmt);
	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);
	RETURN IIF(isnull(@page_count,0)=0,1,@page_count);
END





