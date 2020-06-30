
CREATE PROCEDURE [dbo].[afcs_consumer_sel]  
(  
   @username NVARCHAR(11)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	DECLARE @consumer_hash_key NVARCHAR(MAX)=null
	DECLARE @mobile_no NVARCHAR(20)=null
	DECLARE @qr_id int =null
	DECLARE @credit_amount decimal(18,2)=0
	DECLARE @hash_key NVARCHAR(MAX)=null
	DECLARE @hash_key2 NVARCHAR(MAX)=null
	DECLARE @email NVARCHAR(50)=null
    DECLARE @last_name NVARCHAR(50)=null
	DECLARE @first_name NVARCHAR(50)=null
	DECLARE @middle_name NVARCHAR(50)=null
	DECLARE @activation_code NVARCHAR(50)=null
	DECLARE @birthdate NVARCHAR(50)=null
	DECLARE @address NVARCHAR(500)=null
	DECLARE @gender char(1)=null
	DECLARE @image_filename NVARCHAR(MAX)=null
	DECLARE @is_active char(1)=null

	SELECT @qr_id=qr_id,@email=email, @last_name = last_name, @first_name = first_name, @middle_name = middle_name, 
	       @activation_code=activation_code,@is_active = is_active, @mobile_no=mobile_no, 
		   @birthdate=birthdate,@address=[address],@image_filename=image_filename, @consumer_hash_key = hash_key
	  FROM dbo.consumers WHERE mobile_no = @username

    IF isnull(@mobile_no,'')<>''
	BEGIN
		IF isnull(@qr_id,0) <> 0
		   SELECT @credit_amount= balance_amt, @hash_key=hash_key,@hash_key2=hash_key2 FROM dbo.generated_qrs_registered_v where id = @qr_id

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
	END



/*
	SELECT
	      a.email
		, a.first_name
		, ISNULL(a.middle_name, '') AS middle_name
		, a.last_name
		, ISNULL(a.[address], '') AS [address]
		, a.is_active
		, ISNULL(b.balance_amt, 0) AS credit_amount
		, ISNULL(b.hash_key, '') AS hash_key
		, ISNULL(a.activation_code, '') AS activation_code
		, ISNULL(a.birthdate, '') AS birthdate
		, ISNULL(image_filename, '') AS image_filename
		, ISNULL(b.hash_key2, '') AS hash_key2
		, ISNULL(a.gender, '') AS gender
	FROM dbo.consumers a
	LEFT JOIN dbo.generated_qrs_registered_v b
	ON a.consumer_id = b.consumer_id
	WHERE 1 = 1
	AND a.mobile_no = @username;
*/
END;