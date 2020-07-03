CREATE procedure [dbo].[clients_upd](
   @client_id  int=null
  ,@client_code    char(10)=null
  ,@client_name nvarchar(50)=null
  ,@client_phone_no nvarchar(20)=null
  ,@client_mobile_no nvarchar(20)=null
  ,@client_email_add nvarchar(30)=null
  ,@user_id   int
  ,@is_active char(1)='Y'
  ,@billing_address nvarchar(max)=null
  ,@country_id  int=null
  ,@state_id  int=null
  ,@city_id  int=null
  ,@registration_date date=null
  ,@account_exec_id int=null
  ,@billing_class_id int=null
  ,@bank_acct_no nvarchar(20)=null
  ,@bank_id int=null
  ,@is_tax_exempt char(1)='Y'
  ,@client_tin nvarchar(20)=null
  ,@payment_mode_id int=null
  ,@is_zload char(1)=null
  ,@is_zfare char(1)=null
  ,@id	INT=NULL 
)
as
BEGIN
   SET NOCOUNT ON
	 DECLARE @seq_no int
	 SELECT @seq_no = max(client_id) FROM dbo.clients
	 SET @id = @client_id
	 IF ISNULL(@is_zfare,'')=''
	 BEGIN
		SET @client_code = CONCAT('LMRT-' ,RIGHT('000' + CAST(@seq_no+1 AS NVARCHAR(3)), 3 ))
	 END
	 ELSE
	 BEGIN
		SET @client_code = CONCAT('FCLT-' ,RIGHT('000' + CAST(@seq_no+1 AS NVARCHAR(3)), 3 ))
	 END
	 IF ISNULL(@client_id,0)=0
	 BEGIN
		INSERT INTO dbo.clients
		 (
		  client_code
		 ,client_name
		 ,client_phone_no
		 ,client_mobile_no
		 ,client_email_add
		 ,is_active
		 ,billing_address
		 ,country_id
		 ,state_id
		 ,city_id
		 ,registration_date
		 ,account_exec_id
		 ,billing_class_id
		 ,bank_acct_no
		 ,bank_id
		 ,is_tax_exempt
		 ,client_tin
		 ,payment_mode_id
		 ,is_zload
		 ,is_zfare
		 ,created_by
		 ,created_date
		 ) VALUES
		 (
		  @client_code
		 ,@client_name
		 ,@client_phone_no
		 ,@client_mobile_no
		 ,@client_email_add
		 ,@is_active
		 ,@billing_address
		 ,@country_id
		 ,@state_id
		 ,@city_id
		 ,@registration_date
		 ,@account_exec_id
		 ,@billing_class_id
		 ,@bank_acct_no
		 ,@bank_id
		 ,@is_tax_exempt
		 ,@client_tin
		 ,@payment_mode_id
		 ,@is_zload
		 ,@is_zfare
		 ,@user_id
		 ,GETDATE()
		 );
		 SET @id = @@IDENTITY
		 
		 RETURN @id; 
	END
	ELSE
	   UPDATE dbo.clients SET
			    --client_code			= @client_code
			   client_name			= @client_name
			   ,client_phone_no		= @client_phone_no
			   ,client_mobile_no    = @client_mobile_no
			   ,client_email_add    = @client_email_add
  			   ,is_active			= @is_active
			   ,billing_address		= @billing_address
			   ,country_id			= @country_id
			   ,state_id			= @state_id
			   ,city_id				= @city_id
			   ,registration_date	= @registration_date
			   ,account_exec_id		= @account_exec_id
			   ,billing_class_id	= @billing_class_id
			   ,bank_acct_no		= @bank_acct_no
			   ,bank_id				= @bank_id
			   ,is_tax_exempt		= @is_tax_exempt
			   ,client_tin			= @client_tin
			   ,payment_mode_id		= @payment_mode_id
			   ,is_zload			= @is_zload
			   ,is_zfare			= @is_zfare
			   ,updated_by			= @user_id
			   ,updated_date		= GETDATE();
END;
