
Create procedure [dbo].[suppliers_upd](
   @supplier_id  int=null
  ,@supplier_code    char(10)=null
  ,@supplier_name nvarchar(50)=null
  ,@supplier_phone_no nvarchar(20)=null
  ,@supplier_mobile_no nvarchar(20)=null
  ,@supplier_email_add nvarchar(30)=null 
  ,@billing_address nvarchar(max)=null
  ,@country_id  int=null
  ,@state_id  int=null
  ,@city_id  int=null
  ,@is_active varchar(1)='Y'
  ,@bank_acct_no nvarchar(20)=null 
  ,@is_tax_exempt nvarchar(20)=null
  ,@payment_mode_id nvarchar(20)=null
  ,@user_id   int
)
as
BEGIN
   SET NOCOUNT ON
	 IF ISNULL(@supplier_id,0)=0
		INSERT INTO dbo.suppliers
		 (
		  supplier_code
		 ,supplier_name
		 ,supplier_phone_no
		 ,supplier_mobile_no
		 ,supplier_email_add
		 ,billing_address
		 ,country_id
		 ,state_id
		 ,city_id 
		 ,is_active
		 ,bank_acct_no
		 ,is_tax_exempt
		 ,payment_mode_id
		 ,created_by
		 ,created_date
		 ) VALUES
		 (
		  @supplier_code
		 ,@supplier_name
		 ,@supplier_phone_no
		 ,@supplier_mobile_no
		 ,@supplier_email_add
		 ,@billing_address
		 ,@country_id
		 ,@state_id
		 ,@city_id
		 ,@is_active
		 ,@bank_acct_no
		 ,@is_tax_exempt
		 ,@payment_mode_id
		 ,@user_id
		 ,GETDATE()
		 ) 
	ELSE
	   UPDATE dbo.suppliers SET
			    supplier_code			= @supplier_code
			   ,supplier_name			= @supplier_name
			   ,supplier_phone_no		= @supplier_phone_no
			   ,supplier_mobile_no		= @supplier_mobile_no
			   ,supplier_email_add		= @supplier_email_add 
			   ,billing_address			= @billing_address
			   ,country_id				= @country_id
			   ,state_id				= @state_id
			   ,city_id					= @city_id
			   ,is_active				= @is_active
			   ,bank_acct_no			= @bank_acct_no
			   ,is_tax_exempt			= @is_tax_exempt
			   ,payment_mode_id			= @payment_mode_id
			   ,updated_by				= @user_id
			   ,updated_date			= GETDATE();
END;

