CREATE PROCEDURE [dbo].[procurement_dashboard_sel]
(
    @tab_name          NVARCHAR(30) = null  
   ,@user_id		   INT 
   ,@col_no			   INT = 1
   ,@order_no		   INT = 0
   ,@pno INT = 1
   ,@rpp INT = 100
)
AS
BEGIN
SET NOCOUNT ON
  DECLARE @stmt VARCHAR(MAX)
  DECLARE @stmt2		NVARCHAR(MAX)
  DECLARE @role_id      INT
  DECLARE @count		INT = 0;
  DECLARE @page_count	INT = 1;
  CREATE TABLE #tt ( 
    rec_count INT
  )
  SELECT @role_id=role_id FROM users where user_id=@user_id;

  SET @stmt =  'SELECT * FROM dbo.procurement_detail_with_bal_v WHERE 1=1 '
  SET @stmt2 = 'SELECT count(*) FROM dbo.procurement_detail_with_bal_v WHERE  1=1 '

  IF ISNULL(@tab_name,'')<>''
  BEGIN
	 SET @stmt = @stmt + ' AND procurement_type = ''' + @tab_name + ''''
	 SET @stmt2 = @stmt2 + '  AND procurement_type = ''' + @tab_name + ''''
  END

 -- SET @stmt = @stmt + ' AND role_id = '+ cast(@role_id as varchar(20)) 

  SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC';
  ELSE
     SET @stmt = @stmt + ' DESC';
 
    INSERT INTO #tt EXEC(@stmt2);
    SELECT @count=rec_count FROM #tt;
	DROP TABLE #tt

	SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY '; 
	EXEC(@stmt);

	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);

	--print @page_count;
	RETURN IIF(isnull(@page_count,0)=0,1,@page_count);
END


