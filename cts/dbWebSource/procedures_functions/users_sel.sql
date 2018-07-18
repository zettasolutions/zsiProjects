

CREATE PROCEDURE [dbo].[users_sel]  
(  
    @user_id int = NULL 
   ,@logon varchar(50) = NULL  
   ,@password nvarchar(50) =NULL  
   ,@is_active varchar(1)='Y'  
)  
AS  
BEGIN  
  SET NOCOUNT ON
  DECLARE @stmt           VARCHAR(4000);  
  DECLARE @order          VARCHAR(4000);  

  SET @stmt = 'SELECT *,dbo.countUserRoles(user_id) countUserRoles FROM users_v WHERE is_active=''' + @is_active + ''''  
  
  IF ISNULL(@logon,'') <>''  
  BEGIN  
      SET @stmt = @stmt + ' AND logon = ''' + @logon + '''';   
  END  
  IF ISNULL(@password,'') <>''  
  BEGIN  
      SET @stmt = @stmt + ' AND password = ''' + @password + '''';   
  END
  IF ISNULL(@user_id,'') <> ''
  BEGIN  
	SET @stmt = @stmt + ' AND user_id = ''' + CAST(@user_id AS VARCHAR(20)) + '''';   
  END
  SET @stmt = @stmt + ' ORDER BY userFullName ';
  EXEC(@stmt);  
END;  
  
  
  




