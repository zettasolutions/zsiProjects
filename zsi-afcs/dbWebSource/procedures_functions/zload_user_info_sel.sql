
CREATE PROCEDURE [dbo].[zload_user_info_sel]  
(  
   @user_id INT = NULL
   , @hash_key NVARCHAR(MAX)
   --, @client_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @loader_id INT;

	SELECT 
		@loader_id = [user_id] 
	FROM dbo.[loaders_personnels_active_v] 
	WHERE hash_key = @hash_key
	--and company_id=@client_id;

	IF @loader_id IS NOT NULL
	BEGIN
		SELECT 
			hash_key
			, full_name AS personnel_name
			, 'Y' AS is_valid
			, 'Success' AS msg
		FROM dbo.[loaders_personnels_active_v] 
		WHERE 1 = 1
		AND [user_id] = @loader_id;
	END
	ELSE
	BEGIN
		SELECT
			'' AS hash_key
			, '' AS personnel_name
			, 'N' AS is_valid
			, 'Error' AS msg
	END
END;