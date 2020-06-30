CREATE PROCEDURE [dbo].[dd_clients_password_sel]
( 
     @user_id INT = NULL
)
AS
BEGIN
	SELECT user_id, password FROM dbo.users;
 END;



