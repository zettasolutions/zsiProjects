

CREATE PROCEDURE [dbo].[user_roles_sel]  
(  
    @app_user_id int = null
   ,@user_id int = null
   ,@is_active varchar(1)='Y'  
)  
AS  
BEGIN  
  SET NOCOUNT ON
  DECLARE @stmt           VARCHAR(4000);  
  DECLARE @order          VARCHAR(4000);  
  DECLARE @client_id      INT
  SELECT @client_id=client_id FROM dbo.users WHERE user_id=@app_user_id;

  IF ISNULL(@app_user_id,0) = 0
      SELECT NULL user_role_id, NULL as app_user_id, role_id, role_name, client_id FROM roles where client_id=@client_id;
  ELSE
  BEGIN
	  SET @stmt = 'SELECT * FROM ( SELECT user_role_id, app_user_id, role_id, role_name FROM user_roles_v WHERE app_user_id = ' + CAST(@app_user_id AS VARCHAR(20));   
	  SET @stmt = @stmt + ' UNION SELECT NULL user_role_id, NULL as app_user_id, role_id, role_name FROM roles where client_id=' + CAST(@client_id AS VARCHAR(20)) + ' AND role_id not IN (select role_id from user_roles_v '
	  SET @stmt = @stmt + ' WHERE app_user_id = ' + CAST(@app_user_id AS VARCHAR(20));   
      SET @stmt = @stmt + ')) x WHERE 1=1 '
      EXEC(@stmt);  
  END
END;  
  
 --[user_roles_sel] @app_user_id=3