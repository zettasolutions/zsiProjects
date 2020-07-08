
CREATE PROCEDURE [dbo].[zload_user_info_sel]  
(  
   @user_id INT = NULL
   , @hash_key NVARCHAR(MAX)
   --, @client_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @role_id INT = 4; -- role_id defined for loader personnel
	DECLARE @uuser_id INT;

	SELECT 
		@uuser_id = [user_id] 
	FROM dbo.[loaders_v] 
	WHERE hash_key = @hash_key
	--and company_id=@client_id;

	IF @uuser_id IS NOT NULL
	BEGIN
		SELECT 
			hash_key
			, CONCAT(first_name, ' ', last_name) AS personnel_name
			, 'Y' AS is_valid
			, 'Success' AS msg
		FROM dbo.[users] 
		WHERE 1 = 1
		AND [user_id] = @uuser_id;
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