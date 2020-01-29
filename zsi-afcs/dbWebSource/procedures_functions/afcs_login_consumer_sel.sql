
CREATE PROCEDURE [dbo].[afcs_login_consumer_sel]  
(  
   @username NVARCHAR(300)
   , @password NVARCHAR(50)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT
	      email
		, first_name
		, last_name
		, is_active
		, credit_amount
	FROM dbo.consumers WHERE 1 = 1
	AND is_active = 'Y'
	AND email = @username
	AND [password] = @password
END;