
CREATE PROCEDURE [dbo].[zload_login_sel]  
(  
   @user_id INT = NULL
   , @merchant_hash_key NVARCHAR(MAX)
   , @user_hash_key NVARCHAR(MAX)
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	
	SELECT
		a.client_id
		, a.client_name
		, a.hash_key AS merchant_hash_key
		, b.full_name AS loader_name
		, b.hash_key AS user_hash_key
	FROM zsi_crm.dbo.clients a
	JOIN dbo.[users] b
	ON a.client_id = b.company_id
	WHERE 1 = 1
	AND a.is_active = 'Y'
	AND b.is_active = 'Y'
	AND a.is_zload = 'Y'
	AND a.hash_key = @merchant_hash_key
	AND b.hash_key = @user_hash_key;
END;