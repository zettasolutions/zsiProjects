

CREATE PROCEDURE [dbo].[afcs_activate_upd]  
(  
   @username NVARCHAR(100)
   , @activation_code NVARCHAR(6)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @count INT = 0;

	SELECT 
		@count = COUNT(consumer_id) 
	FROM dbo.consumers WHERE 1 = 1 
	AND [email] = @username
	AND [activation_code] = @activation_code

	IF @count = 1
	BEGIN
		BEGIN TRAN;

		UPDATE dbo.consumers
		SET 
			is_active = 'Y'
			, updated_date = GETDATE()
		WHERE 1 = 1
		AND [email] = @username
		AND [activation_code] = @activation_code

		IF @@ERROR = 0
		BEGIN
			COMMIT;
			SELECT 
			'Y' is_valid
			, 'Activation successful. Welcome to zPay!' AS msg
		END
		ELSE
		BEGIN
			ROLLBACK;
			SELECT 
			'N' is_valid
			, 'An error occurred. Please contact system support.' AS msg
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' is_valid
			, 'Invalid acitivation code. Please try again.' AS msg
	END
END;