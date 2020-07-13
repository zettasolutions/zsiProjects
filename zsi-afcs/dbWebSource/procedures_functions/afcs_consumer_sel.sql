
CREATE PROCEDURE [dbo].[afcs_consumer_sel]  
(  
   @username NVARCHAR(11)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @consumer_hash_key NVARCHAR(MAX) = NULL
	DECLARE @mobile_no NVARCHAR(20) = NULL
	DECLARE @qr_id INT = NULL
	DECLARE @credit_amount DECIMAL(18, 2) = 0
	DECLARE @hash_key NVARCHAR(MAX) = NULL
	DECLARE @hash_key2 NVARCHAR(MAX) = NULL
	DECLARE @email NVARCHAR(50) = NULL
    DECLARE @last_name NVARCHAR(50) = NULL
	DECLARE @first_name NVARCHAR(50) = NULL
	DECLARE @middle_name NVARCHAR(50) = NULL
	DECLARE @activation_code NVARCHAR(50) = NULL
	DECLARE @birthdate NVARCHAR(50) = NULL
	DECLARE @address NVARCHAR(500) = NULL
	DECLARE @gender CHAR(1) = NULL
	DECLARE @image_filename NVARCHAR(MAX) = NULL
	DECLARE @is_active CHAR(1) = NULL
	DECLARE @expiry_date DATETIME = NULL;

	SELECT 
		@qr_id = qr_id
		, @email = email
		, @last_name = last_name
		, @first_name = first_name
		, @middle_name = middle_name
		, @activation_code = activation_code
		, @is_active = is_active
		, @mobile_no = mobile_no
		, @birthdate = birthdate
		, @address = [address]
		, @image_filename = image_filename
		, @consumer_hash_key = hash_key
	FROM dbo.consumers 
	WHERE 1 = 1
	AND mobile_no = @username;

    IF ISNULL(@mobile_no, '') <> ''
	BEGIN
		IF ISNULL(@qr_id,0) <> 0
		BEGIN
			SELECT 
				@credit_amount = balance_amt
				, @hash_key = hash_key
				, @hash_key2 = hash_key2 
				, @expiry_date = [expiry_date]
			FROM dbo.generated_qrs_registered_v 
			WHERE 1 = 1
			AND id = @qr_id;
		END

		SELECT
			ISNULL(@email,'')				email
			, @first_name					first_name
			, ISNULL(@middle_name, '')		middle_name
			, @last_name					last_name
			, ISNULL(@address, '')			[address]
			, @is_active					is_active
			, ISNULL(@credit_amount,0)		credit_amount
			, ISNULL(@hash_key, '')			hash_key
			, ISNULL(@activation_code, '')  activation_code
			, ISNULL(@birthdate, '')		birthdate
			, ISNULL(@image_filename, '')	image_filename
			, ISNULL(@hash_key2, '')		hash_key2
			, ISNULL(@gender, '')			gender
			, @consumer_hash_key			consumer_hash_key
			, @expiry_date					[expiry_date]
	END
END;