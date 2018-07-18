CREATE PROCEDURE [dbo].[user_menus_sel]
(
   @user_id int
)
AS
BEGIN
   declare @is_add CHAR(1)='N'
   declare @is_admin CHAR(1)='N'
   declare @client_id INT
   DECLARE @stmt NVARCHAR(MAX)=''

   SELECT @is_add=is_add, @is_admin=is_admin,@client_id=client_id FROM dbo.users WHERE user_id = @user_id;
   IF ISNULL(@is_add,'N')='Y'
   BEGIN
     SET @stmt = 'SELECT 0 seq_no, ''plus'' icon, null param, ''Compose'' menu_text, ''composeRequest'' page_name '
     SET @stmt = @stmt + 'UNION SELECT seq_no, icon, param, concat(menu_text,'' ('',rcount,'')'') menu_text, page_name FROM 
	                      (select seq_no, icon, status_id param, status_name menu_text, ''ListOfRequests'' page_name, dbo.countUserRequestByStatus(' + CAST(@user_id AS VARCHAR(20)) + ', status_id) rcount from dbo.statuses) x WHERE rcount > 0 '
   END

   IF @stmt<>''
      SET @stmt = @stmt + 'UNION '

   SET @stmt = @stmt + 'SELECT seq_no, icon, param, concat(menu_text,'' ('',rcount,'')'') menu_text, page_name FROM 
                        (select seq_no, icon, process_id param, process_title menu_text, ''ListOfRequests'' page_name,dbo.countUserRequestByProcess(' + CAST(@user_id AS VARCHAR(20)) + ','+ CAST(@client_id AS VARCHAR(20)) + ', process_id) rcount from dbo.processes) x WHERE rcount > 0 '
                        
   IF ISNULL(@is_admin,'N')='Y'
   BEGIN
      IF @stmt<>''
	     SET @stmt = @stmt + 'UNION '

	     SET @stmt = @stmt + 'select seq_no, icon , null param, menu_name menu_text, page_name from menus_v ORDER BY seq_no'
   END
   print @stmt;
   EXEC(@stmt);
END

--update users set is_admin='Y' where user_id=3
--user_menus_sel @user_id=7
--select * from dbo.requests_v
--update requests set process_id=1, status_id=1
