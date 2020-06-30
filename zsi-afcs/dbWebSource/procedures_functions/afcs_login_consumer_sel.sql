
CREATE PROCEDURE [dbo].[afcs_login_consumer_sel]  
(  
   @username NVARCHAR(300)
   , @password NVARCHAR(50)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	DECLARE @mobile_no NVARCHAR(20)=null
	DECLARE @qr_id int =null
	DECLARE @credit_amount decimal(18,2)=0
	DECLARE @hash_key NVARCHAR(50)=null
	DECLARE @email NVARCHAR(50)=null
    DECLARE @last_name NVARCHAR(50)=null
	DECLARE @first_name NVARCHAR(50)=null
	DECLARE @is_active char(1)=null

	SELECT @qr_id=qr_id,@email=email, @last_name = last_name, @first_name = first_name, @is_active = is_active, @mobile_no=mobile_no 
	  FROM dbo.consumers WHERE mobile_no = @username AND dbo.securityDecrypt([password]) = @password;

    IF isnull(@mobile_no,'')<>''
	BEGIN
		IF isnull(@qr_id,0) <> 0
		   SELECT @credit_amount= balance_amt, @hash_key=hash_key FROM dbo.generated_qrs_registered_v where id = @qr_id

		SELECT
			  @mobile_no	 mobile_no
			, @email		 email
			, @first_name	 first_name
			, @last_name	 last_name
			, @is_active	 is_active
			, @credit_amount credit_amount
			, @hash_key		 hash_key

	END

END;

