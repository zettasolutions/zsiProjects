CREATE PROCEDURE [dbo].[dd_clients_password_sel]
( 
      @user_id INT = NULL
	 ,@id INT = NULL
)
AS
BEGIN
	SELECT user_id, convert(varchar(100),DecryptByPassPhrase('key',password )) AS password  FROM dbo.users WHERE user_id = @id;
 END;
