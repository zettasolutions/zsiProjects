


CREATE PROCEDURE [dbo].[process_statuses_sel](
  @is_active CHAR(1) = 'Y'
 ,@sort_index INT=1
 ,@sort_order INT=0
 ,@rpp        INT=25
 ,@pno        INT= 1
 ,@user_id    INT=null
 ,@process_id INT=null
)

AS
BEGIN

	SET NOCOUNT ON
	DECLARE @stmt         NVARCHAR(MAX)
	DECLARE @order        NVARCHAR(20)=' ASC'
	DECLARE @stmt2        NVARCHAR(MAX)
	DECLARE @count		  INT = 0
	DECLARE @result_param NVARCHAR(500)
	DECLARE @page_count	  INT = 1

	IF @sort_order = 1
	   SET @order = ' DESC'

	SET @stmt = 'SELECT * FROM dbo.process_statuses WHERE is_active=''' + @is_active + '''';

	IF ISNULL(@process_id, 0) <> 0
		SET @stmt = @stmt + 'AND process_id=' + CAST(@process_id AS varchar(20)) + '';

	SET @stmt2 = N'SELECT @result = COUNT(*) FROM dbo.process_statuses WHERE is_active=''' + @is_active + '''';
	SET @result_param = N'@result varchar(30) OUTPUT';
	EXECUTE sp_executesql @stmt2, @result_param, @result=@Count OUTPUT;

	SET @stmt = @stmt +  ' ORDER BY ' + cast(@sort_index as varchar(20)) + @order;
	SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY '; 

	EXEC(@stmt);
	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);
	RETURN IIF(isnull(@page_count,0)=0,1,@page_count);
END