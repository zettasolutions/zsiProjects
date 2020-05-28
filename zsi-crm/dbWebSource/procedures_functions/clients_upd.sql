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
)
as
BEGIN
   SET NOCOUNT ON
	 IF ISNULL(@client_id,0)=0
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
		 ,@user_id
		 ,GETDATE()
		 ) 
	ELSE
	   UPDATE dbo.clients SET
			    client_code			= @client_code
			   ,client_name			= @client_name
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
			   ,updated_by			= @user_id
			   ,updated_date		= GETDATE();
END;
