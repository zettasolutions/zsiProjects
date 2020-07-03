
CREATE PROCEDURE [dbo].[afcs_users_sel]  
(  
   @hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT
		[user_id]
	    , company_code
		, logon
		, position
		, last_name
		, first_name
		, full_name
		, is_active
	FROM dbo.users WHERE 1 = 1
	AND is_active = 'Y'
	AND hash_key = @hash_key
END;