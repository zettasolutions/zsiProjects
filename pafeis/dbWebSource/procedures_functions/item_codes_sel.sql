
CREATE PROCEDURE [dbo].[item_codes_sel]
(
    @item_cat_id  INT = null 
   ,@item_type_id  INT = null
   ,@is_active CHAR(1) = 'Y'
   ,@link_value int = 0
   ,@col_name nvarchar(100)=null
   ,@keyword nvarchar(20)=null
   ,@col_no   int = 1
   ,@order_no int = 0
   ,@pno INT = 1
   ,@rpp INT = 25
   ,@user_id INT = NULL
)

AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt			NVARCHAR(MAX)
  DECLARE @stmt2		NVARCHAR(MAX)
  DECLARE @order        VARCHAR(4000);
  DECLARE @count		INT = 0;
  DECLARE @page_count	INT = 1;
  CREATE TABLE #tt ( 
    rec_count INT
  )
  SET @stmt = 'SELECT * FROM dbo.item_codes_v WHERE is_active=''' + @is_active + '''';
  SET @stmt2 = 'SELECT count(*) FROM dbo.item_codes WHERE is_active=''' + @is_active + '''';

  IF ISNULL(@item_cat_id,0) <> 0
  BEGIN
     SET @stmt = @stmt + ' AND item_cat_id=' + cast(@item_cat_id AS VARCHAR(20))
	 SET @stmt2 = @stmt2 + ' AND item_cat_id=' + cast(@item_cat_id AS VARCHAR(20))
  END

  IF ISNULL(@item_type_id,0) <> 0
  BEGIN
     SET @stmt = @stmt + ' AND item_type_id=' + cast(@item_type_id AS VARCHAR(20))
	 SET @stmt2 = @stmt2 + ' AND item_type_id=' + cast(@item_type_id AS VARCHAR(20))
  END

  IF @col_name IS NOT NULL AND @keyword IS NOT NULL
  BEGIN
     SET @stmt = @stmt + ' AND ' + @col_name + ' like ''' + @keyword + '%'''
     SET @stmt2 = @stmt2 + ' AND ' + @col_name + ' like ''' + @keyword + '%'''
  END

  IF @link_value > 0 
  BEGIN
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

END


