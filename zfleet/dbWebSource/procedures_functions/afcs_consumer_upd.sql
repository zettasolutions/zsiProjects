

CREATE PROCEDURE [dbo].[afcs_consumer_upd]  
(  
   @username NVARCHAR(100)
   , @first_name NVARCHAR(300)
   , @middle_name NVARCHAR(300)
   , @last_name NVARCHAR(300)
   , @address NVARCHAR(300)
   , @birthdate DATE
   , @password NVARCHAR(50)
   , @image NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	BEGIN TRAN;

	UPDATE 
		dbo.consumers
	SET
		first_name = @first_name
		, middle_name = @middle_name
		, last_name = @last_name
		, [address] = @address
		, [password] = @password
		, image_filename = @image
		, birthdate = @birthdate
	WHERE 1 = 1
	AND email = @username;

	IF @@ERROR = 0
	BEGIN
		COMMIT;
		
		SELECT
			'Y' AS is_valid
			, 'Success' AS msg
			, a.email
			, a.first_name
			, ISNULL(a.middle_name, '') AS middle_name
			, a.last_name
			, ISNULL(a.[address], '') AS [address]
			, a.is_active
			, b.balance_amt AS credit_amount
			, b.hash_key
			, ISNULL(a.birthdate, '') AS birthdate
		FROM dbo.consumers a
		LEFT JOIN dbo.generated_qrs b
		ON a.consumer_id = b.consumer_id
		WHERE 1 = 1
		AND b.is_active = 'Y'
		AND a.email = @username;
	END
	ELSE
	BEGIN
		ROLLBACK;

		SELECT
			'N' AS is_valid
			, 'Failed' AS msg
			, a.email
			, a.first_name
			, ISNULL(a.middle_name, '') AS middle_name
			, a.last_name
			, ISNULL(a.[address], '') AS [address]
			, a.is_active
			, b.balance_amt AS credit_amount
			, b.hash_key
			, ISNULL(a.birthdate, '') AS birthdate
		FROM dbo.consumers a
		LEFT JOIN dbo.generated_qrs b
		ON a.consumer_id = b.consumer_id
		WHERE 1 = 1
		AND b.is_active = 'Y'
		AND a.email = @username;
	END
END;