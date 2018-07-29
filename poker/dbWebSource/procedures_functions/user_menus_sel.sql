
CREATE PROCEDURE [dbo].[user_menus_sel]
(
   @user_id int=null
)
AS
BEGIN
   declare @is_add CHAR(1)='N'
   declare @is_admin CHAR(1)='N'
   declare @client_id INT
   DECLARE @stmt NVARCHAR(MAX)=''

--   SELECT @is_add=is_add, @is_admin=is_admin,@client_id=client_id FROM dbo.users WHERE user_id = @user_id;
   select * from dbo.menus
END

--update users set is_admin='Y' where user_id=3
--user_menus_sel @user_id=3
--select * from dbo.requests_v
--update requests set process_id=1, status_id=1

