

CREATE PROCEDURE [dbo].[afcs_register_consumer_upd]  
(  
   @email NVARCHAR(100)
   , @first_name NVARCHAR(300)
   , @last_name NVARCHAR(300)
   , @password NVARCHAR(50)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @id INT;

	BEGIN TRAN;

	INSERT INTO [dbo].[consumers]
		(hash_key
		, is_active
		, first_name
		, last_name
		, email
		, [password]
		, created_by
		, created_date)
	VALUES
		(NEWID()
		, 'Y'
		, @first_name
		, @last_name
		, @email
		, @password
		, @user_id
		, GETDATE())

	SELECT @id = @@IDENTITY;

	IF @@ERROR = 0
	BEGIN
		COMMIT;
	END
	ELSE
	BEGIN
		ROLLBACK;
	END

	IF @@ERROR = 0
		SELECT 
			hash_key
		FROM dbo.consumers WHERE 1 = 1 
		AND consumer_id = @id;
END;