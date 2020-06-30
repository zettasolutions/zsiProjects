
CREATE PROCEDURE [dbo].[afcs_consumer_sel]  
(  
   @username NVARCHAR(300)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT
	      a.email
		, a.first_name
		, ISNULL(a.middle_name, '') AS middle_name
		, a.last_name
		, ISNULL(a.[address], '') AS [address]
		, a.is_active
		, b.balance_amt AS credit_amount
		, b.hash_key
		, ISNULL(a.activation_code, '') AS activation_code
		, ISNULL(a.birthdate, '') AS birthdate
		, image_filename
	FROM dbo.consumers a
	LEFT JOIN dbo.generated_qrs b
	ON a.consumer_id = b.consumer_id
	WHERE 1 = 1
	AND b.is_active = 'Y'
	AND a.email = @username;
END;