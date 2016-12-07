

CREATE PROCEDURE [dbo].[users2_sel]
(
    @user_id int = NULL
   ,@filter_user_id int = NULL
   ,@logon varchar(50) = NULL
   ,@password nvarchar(50) =NULL
   ,@is_active varchar(1)='Y'
   ,@role_id INT=null
   ,@is_contact varchar(1)='N'
   ,@col_no INT = 3
   ,@order_no INT = 0
   ,@pno INT = 1
   ,@rpp INT = 100
)
AS
BEGIN
  DECLARE @stmt           VARCHAR(4000);
  DECLARE @order          VARCHAR(4000);
  DECLARE @count INT = 0;
  DECLARE @page_count INT = 1;
  
  SET @stmt = 'SELECT user_id, logon, password, password, is_admin, role_id, rankDesc, position, organizationName  FROM user_role_v WHERE is_active = ''' + CAST(@is_active AS VARCHAR(1)) + ''''; 
  SET @order = ' ORDER BY ' + CAST(@col_no + 1 AS VARCHAR(1)) + ' ' + IIF(@order_no=0,'ASC','DESC');   
  SELECT @count = COUNT(*) FROM dbo.user_role_v WHERE is_active = @is_active; 

 IF ISNULL(@filter_user_id,'') <>''
  BEGIN
      SET @stmt = @stmt + ' AND user_id = ' + CAST(@filter_user_id AS VARCHAR(20)); 
      SET @count = 1;
  END

  IF ISNULL(@logon,'') <>''
  BEGIN
      SET @stmt = @stmt + ' AND logon = ''' + @logon + ''''; 
      SET @count = 1;
  END
  IF ISNULL(@password,'') <>''
  BEGIN
      SET @stmt = @stmt + ' AND password = ''' + @password + ''''; 
      SET @count = 1;
  END

  IF ISNULL(@role_id,0) <> 0 
  BEGIN
      SET @stmt = @stmt + ' AND role_id = ' + CAST(@role_id AS VARCHAR(20)); 
	  SELECT @count = COUNT(*) FROM dbo.user_role_v WHERE is_active = @is_active AND role_id =@role_id
  END

  IF @is_contact='Y'
  BEGIN
      SET @stmt = @stmt + ' AND is_contact = ''' + @is_contact + ''''; 
	  SELECT @count = COUNT(*) FROM dbo.user_role_v WHERE is_active = @is_active AND is_contact =@is_contact
	  SET @order = ' ORDER BY contact_seq_NO'
  END

	SET @stmt = @stmt + @order
	SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY '; 
	EXEC(@stmt);

	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);
	print @page_count;
	RETURN @page_count;
END;





