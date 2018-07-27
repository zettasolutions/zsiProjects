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
   DECLARE @table NVARCHAR(100)=''

   SELECT @is_add=is_add, @is_admin=is_admin,@client_id=client_id FROM dbo.users WHERE user_id = @user_id;
   SET @table = CONCAT('dbo.data_',@client_id,'_requests');
   IF ISNULL(@is_add,'N')='Y'
   BEGIN
     SET @stmt = 'SELECT 0 seq_no, ''plus'' icon, null status_id, null process_id, ''Compose'' menu_text, ''tmplComposeRequest'' page_name '
     SET @stmt = @stmt + 'UNION SELECT seq_no, icon, status_id, null process_id, status_name menu_text, ''tmplRequestLists'' page_name ' +
	                     'FROM dbo.statuses WHERE status_id IN (SELECT status_id FROM ' + @table + ' WHERE created_by ='+ CAST(@user_id AS VARCHAR(20)) + ')'
   END

   IF @stmt<>''
      SET @stmt = @stmt + 'UNION '

   SET @stmt = @stmt + 'SELECT seq_no, icon, null status_id, process_id, process_title menu_text, ''tmplRequestLists'' page_name ' +
                        'FROM dbo.processes WHERE process_id IN (SELECT process_id FROM ' + @table + ' WHERE process_id IN (SELECT process_id FROM dbo.user_role_processes_v where app_user_id = ' + CAST(@user_id AS VARCHAR(20)) +'))'
                        
   IF ISNULL(@is_admin,'N')='Y'
   BEGIN
      IF @stmt<>''
	     SET @stmt = @stmt + 'UNION '

	     SET @stmt = @stmt + 'select seq_no, icon , null status_id, null process_id, menu_name menu_text, page_name from menus_v ORDER BY seq_no'
   END
   EXEC(@stmt);
END

--update users set is_admin='Y' where user_id=3
--user_menus_sel @user_id=2
--select * from dbo.requests_v
--update requests set process_id=1, status_id=1
