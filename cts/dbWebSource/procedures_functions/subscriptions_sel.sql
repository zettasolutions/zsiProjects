
CREATE PROCEDURE [dbo].[subscriptions_sel]
(
    @client_id INT=NULL
   ,@user_id int

)
AS

BEGIN
SET NOCOUNT ON
DECLARE @app_client_id int
DECLARE @stmt NVARCHAR(MAX)
    SELECT @app_client_id=client_id FROM dbo.users where user_id=@user_id;
	IF ISNULL(@client_id,0) <> 0 
		BEGIN
		   SET @stmt = 'SELECT app_id, app_name, subscription_id, subscription_date, no_months, expiry_date FROM dbo.subscriptions_v WHERE client_id=' + CAST(@client_id AS VARCHAR(20));
 		   SET @stmt = @stmt + ' UNION SELECT a.app_id, a.app_name, NULL subscription_id,  NULL subscription_date, NULL no_months, NULL expiry_date FROM dbo.applications a WHERE a.client_id = ' +  CAST(@app_client_id AS VARCHAR(20))
		   SET @stmt = @stmt + ' AND NOT EXISTS (SELECT b.app_id FROM dbo.subscriptions_v b WHERE a.app_id = b.app_id)'
		END 
    ELSE  
	    SET @stmt = 'SELECT app_id, app_name, NULL subscription_id,NULL subscription_date,NULL no_months,NULL expiry_date FROM dbo.applications WHERE client_id=' + CAST(@app_client_id AS VARCHAR(20));
    
	EXEC(@stmt);
END



--[subscriptions_sel] @sub_client_id=1, @user_id=3




