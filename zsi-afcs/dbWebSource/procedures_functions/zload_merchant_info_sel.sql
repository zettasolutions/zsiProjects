
CREATE PROCEDURE [dbo].[zload_merchant_info_sel]  
(  
   @user_id INT = NULL
   , @hash_key NVARCHAR(MAX)
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @client_id INT;
	DECLARE @balance_amount DECIMAL(12, 2);

	SELECT 
		@client_id = client_id 
	FROM dbo.load_merchants_v
	WHERE hash_key = @hash_key;

	IF @client_id IS NOT NULL
	BEGIN
		SELECT 
			hash_key
			, client_name
			, balance_amount
			, 'Y' AS is_valid
			, 'Success' AS msg
		FROM zsi_crm.dbo.clients 
		WHERE 1 = 1
		AND client_id = @client_id;
	END
	ELSE
	BEGIN
		SELECT
			'' AS hash_key
			, '' AS client_name
			, 0 AS balance_amount
			, 'N' AS is_valid
			, 'Error' AS msg
	END
END;