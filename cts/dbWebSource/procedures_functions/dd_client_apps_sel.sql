
CREATE PROCEDURE [dbo].[dd_client_apps_sel]
(
   @user_id int

)
AS

BEGIN
SET NOCOUNT ON
DECLARE @client_id int
DECLARE @stmt NVARCHAR(MAX)
    SELECT @client_id=client_id FROM dbo.users where user_id=@user_id;
    SET @stmt = 'SELECT app_id, app_name FROM dbo.subscriptions_v WHERE is_active=''Y'' AND client_id=' + CAST(@client_id AS VARCHAR(20));
    SET @stmt = @stmt + ' UNION SELECT app_id,app_name FROM dbo.applications WHERE is_active=''Y'' AND client_id = ' +  CAST(@client_id AS VARCHAR(20))
   
	EXEC(@stmt);
END



--[dd_client_apps_sel] @user_id=95



