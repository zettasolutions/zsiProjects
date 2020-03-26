

CREATE PROCEDURE [dbo].[afcs_register_consumer_upd]  
(  
   @email NVARCHAR(100)
   , @first_name NVARCHAR(300)
   , @last_name NVARCHAR(300)
   , @password NVARCHAR(50)
   , @birthdate DATE
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @id INT;
	DECLARE @generated_qr_id INT;
	DECLARE @activation_code NVARCHAR(6);
	DECLARE @server_mail_profile_name NVARCHAR(20) = 'ZPayNotify';
	DECLARE @server_mail_subject NVARCHAR(50) = 'Welcome to zPay';
	DECLARE @server_mail_body_format NVARCHAR(10) = 'HTML';
	DECLARE @server_mail_body NVARCHAR(MAX) = '';
	DECLARE @count_register_email INT = 0;

	SELECT @activation_code = CAST(RAND() * 1000000 AS NVARCHAR(6));

	SET @server_mail_body = N'Welcome to zPay. Your activation code is ';
	SET @server_mail_body = @server_mail_body + @activation_code + '.';
	SET @server_mail_body = @server_mail_body + CHAR(13);
	SET @server_mail_body = @server_mail_body + 'This is an auto-generated email. Please do not reply.';

	SELECT @count_register_email = COUNT(consumer_id) FROM dbo.consumers WHERE 1 = 1 AND email = @email;

	IF @count_register_email = 0
	BEGIN
		BEGIN TRAN;

		INSERT INTO [dbo].[consumers]
			(hash_key
			, is_active
			, first_name
			, last_name
			, email
			, [password]
			, created_by
			, created_date
			, activation_code
			, birthdate
		)
		VALUES
			(NEWID()
			, 'N'
			, @first_name
			, @last_name
			, @email
			, @password
			, @user_id
			, GETDATE()
			, @activation_code
			, @birthdate
		)

		SELECT @id = @@IDENTITY;

		-- Get an unassigned QR and assign it to the new commuter.
		SELECT 
			TOP 1 @generated_qr_id = id
		FROM dbo.generated_qrs 
		WHERE 1 = 1
		AND ISNULL(balance_amt, 0) = 0
		AND is_taken = 'N'
		AND is_active = 'Y'
		AND ISNULL(is_loaded, '') <> 'Y'
		AND ISNULL(consumer_id, 0) = 0
		ORDER BY
			created_date;

		IF @generated_qr_id > 0
		BEGIN
			UPDATE 
				dbo.generated_qrs
			SET
				is_taken = 'Y'
				, consumer_id = @id
				, ref_trans = CONCAT(REPLACE(CONVERT(CHAR(10), GETDATE(), 101), '/', ''), id)
				, updated_by = @user_id
				, updated_date = GETDATE()
			WHERE 1 = 1
			AND id = @generated_qr_id;
		END

		IF @@ERROR = 0
		BEGIN
			COMMIT;
			-- Email new user.
			EXEC msdb.dbo.sp_send_dbmail
				@profile_name = @server_mail_profile_name
			   , @recipients = @email
			   , @subject = @server_mail_subject
			   , @body = @server_mail_body
			   , @body_format = @server_mail_body_format
		END
		ELSE
		BEGIN
			ROLLBACK;
		END

		IF @@ERROR = 0
		BEGIN
			-- Get the qr code in the generated qrs table and set it as the qr code of the commuter.
			SELECT 
				b.hash_key
				, 'Y' AS is_valid
				, 'Success' AS msg
			FROM dbo.consumers a
			JOIN dbo.generated_qrs b
			ON a.consumer_id = b.consumer_id
			WHERE 1 = 1 
			AND a.consumer_id = @id;
		END
	END
	ELSE
	BEGIN
		SELECT 
			'N' is_valid
			, 'Email already exists.' AS msg
	END
END;