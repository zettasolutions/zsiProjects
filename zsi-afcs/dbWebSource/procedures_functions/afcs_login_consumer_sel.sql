
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
	      a.email
		, a.first_name
		, a.last_name
		, a.is_active
		, b.balance_amt AS credit_amount
		, b.hash_key
	FROM dbo.consumers a
	LEFT JOIN dbo.generated_qrs b
	ON a.consumer_id = b.consumer_id
	WHERE 1 = 1
	AND b.is_active = 'Y'
	AND a.email = @username
	AND a.[password] = @password
END;