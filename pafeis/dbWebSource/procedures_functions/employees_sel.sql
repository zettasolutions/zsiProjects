CREATE PROCEDURE [dbo].[employees_sel]
(
      @user_id int = NULL
	 ,@is_active varchar(1) = 'Y'
	 ,@organization_id int = NULL
	 ,@col_name nvarchar(20)=null
     ,@keyword nvarchar(20)=null
	 ,@col_no   int = 1
     ,@order_no int = 0
     ,@pno INT = 1
     ,@rpp INT = 100
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt		    NVARCHAR(MAX);
  DECLARE @stmt2		NVARCHAR(MAX)
  DECLARE @order        NVARCHAR(MAX);
  DECLARE @count		INT = 0;
  DECLARE @page_count	INT = 1;
  CREATE TABLE #tt ( 
    rec_count INT
  )
    
	SET @stmt = 'SELECT * FROM dbo.employees_v WHERE is_active  = ''' + @is_active   + '''';
	SET @stmt2 = 'SELECT count(*) FROM dbo.employees_v WHERE is_active  = ''' + @is_active   + '''';

	IF isnull(@organization_id,0) <> 0
	BEGIN
		SET @stmt = @stmt + ' AND organization_id='+ CAST(@organization_id AS VARCHAR(20));
		SET @count=1
    END
	ELSE
	BEGIN
	    SET @stmt = @stmt + ' AND organization_id IN (SELECT organization_id FROM dbo.organizations_tree(' + cast(@user_id as varchar(20)) + '))' 
		SET @stmt2 = @stmt2 + ' AND organization_id IN (SELECT organization_id FROM dbo.organizations_tree(' + cast(@user_id as varchar(20)) + '))' 
    END

    IF @col_name IS NOT NULL AND @keyword IS NOT NULL
	BEGIN
	   SET @stmt = @stmt + ' AND ' + cast(@col_name as varchar(50)) + ' like ''' + @keyword + '%'''
	   SET @stmt2 = @stmt2 + ' AND ' + cast(@col_name as varchar(50)) + ' like ''' + @keyword + '%'''
	   
	   INSERT INTO #tt EXEC(@stmt2);
       SELECT @count=rec_count FROM #tt;
	   DROP TABLE #tt
	END
	
   SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no AS VARCHAR(20))
   IF @order_no = 0
      SET @stmt = @stmt + ' ASC '
   ELSE
      SET @stmt = @stmt + ' DESC '

	SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY '; 
	EXEC(@stmt);

	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);

	--print @page_count;
	RETURN IIF(isnull(@page_count,0)=0,1,@page_count);
end




