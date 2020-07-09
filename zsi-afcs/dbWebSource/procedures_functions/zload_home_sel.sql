
CREATE PROCEDURE [dbo].[zload_home_sel]  
(  
   @user_id INT = NULL
   , @merchant_hash_key NVARCHAR(MAX)
   , @loader_hash_key NVARCHAR(MAX)
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @client_id INT;
	DECLARE @balance_amount DECIMAL(12, 2);
	DECLARE @loader_name NVARCHAR(300);

	SELECT 
		@client_id = client_id 
	FROM dbo.load_merchants_v
	WHERE hash_key = @merchant_hash_key;

	IF @client_id IS NOT NULL
	BEGIN
		SELECT
			@loader_name = full_name
		FROM dbo.loading_personnels_active_v 
		WHERE hash_key = @loader_hash_key;

		SELECT 
			hash_key
			, client_name
			, balance_amount
			, @loader_name AS loader_name
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
			, '' AS loader_name
			, 'N' AS is_valid
			, 'Error' AS msg
	END
END;