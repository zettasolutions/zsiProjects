
CREATE PROCEDURE [dbo].[afcs_2_driver_info_sel]  
(  
   @user_id INT = NULL
   , @hash_key NVARCHAR(50)
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @uuser_id INT;

	-- Check whether the vehicle is registered and active.
	SELECT @uuser_id = [user_id] FROM dbo.users WHERE 1 = 1 AND hash_key = @hash_key;

	IF @uuser_id IS NOT NULL
	BEGIN
		SELECT
			[user_id]
			, [hash_key]
			, [first_name]
			, [last_name]
			, [img_filename]
			, [is_active]
			, 'Y' AS is_valid
			, 'Success' AS msg
		FROM dbo.users
		WHERE 1 = 1
		AND hash_key = @hash_key;
	END
	ELSE
	BEGIN
		SELECT
			'N' AS is_valid
			, 'Error' AS msg
	END
END;