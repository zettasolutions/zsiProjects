CREATE procedure [dbo].[clients_upd](
   @client_id  int=null
  ,@client_name nvarchar(50)=NULL
  ,@client_phone_no nvarchar(20)=NULL
  ,@client_mobile_no nvarchar(20)=NULL
  ,@client_email_add nvarchar(30)=NULL
  ,@user_id   int=NULL
  ,@is_active char(1)='Y'
  ,@bill_to nvarchar(100)=null
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
  ,@is_zload char(1)='N'
  ,@is_fmis char(1)='N'
  ,@is_hcm char(1)='N'
  ,@is_afcs char(1)='N'
  ,@is_ct char(1)='N'
  ,@id	INT=NULL 
)
as
BEGIN
   SET NOCOUNT ON
	 IF ISNULL(@client_id,0)=0
	 BEGIN
		INSERT INTO dbo.clients
		 (
		  client_name
		 ,client_phone_no
		 ,client_mobile_no
		 ,client_email_add
		 ,is_active
		 ,bill_to
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
		 ,is_fmis
		 ,is_hcm
		 ,is_afcs
		 ,is_ct
		 ,hash_key
		 ,created_by
		 ,created_date
		 ) VALUES
		 (
		  @client_name
		 ,@client_phone_no
		 ,@client_mobile_no
		 ,@client_email_add
		 ,@is_active
		 ,@bill_to
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
		 ,@is_fmis	
		 ,@is_hcm	
		 ,@is_afcs	
		 ,@is_ct	 
		 ,newid()
		 ,@user_id		 
		 ,DATEADD(HOUR, 8, GETUTCDATE())
		 );
		 SET @id = @@IDENTITY
		 BEGIN
			EXEC zsi_afcs.dbo.create_payments_tbl @client_id=@id;
			EXEC zsi_afcs.dbo.create_vehicle_trips_tbl @client_id=@id;
			EXEC zsi_hcm.dbo.create_positions_tbl @client_id=@id;
			EXEC zsi_hcm.dbo.create_shifts_tbl @client_id=@id;
			EXEC zsi_hcm.dbo.create_dept_sect_tbl @client_id=@id;
			EXEC zsi_hcm.dbo.create_employee_tbl @client_id=@id;
			EXEC zsi_hcm.dbo.create_employee_images_tbl @client_id=@id;
			EXEC zsi_hcm.dbo.create_employee_view @client_id=@id;
			EXEC zsi_hcm.dbo.create_dtr_tbl @client_id=@id;
			EXEC zsi_hcm.dbo.create_filed_leaves_tbl @client_id=@id;
			EXEC zsi_hcm.dbo.create_filed_overtime_tbl @client_id=@id;
			EXEC zsi_hcm.dbo.create_payroll_hdr_tbl @client_id=@id;
			EXEC zsi_hcm.dbo.create_payroll_details_tbl @client_id=@id;
		 END;
		 RETURN @id; 
	END
	ELSE
	   UPDATE dbo.clients SET
			    client_name			= @client_name
			   ,client_phone_no		= @client_phone_no
			   ,client_mobile_no    = @client_mobile_no
			   ,client_email_add    = @client_email_add
			   ,bill_to				= @bill_to
			   ,billing_address		= @billing_address
			   ,country_id			= @country_id
			   ,state_id			= @state_id
			   ,city_id				= @city_id
			   ,client_tin			= @client_tin
			   ,is_fmis				= @is_fmis
			   ,is_hcm				= @is_hcm
			   ,is_afcs				= @is_afcs
			   ,is_ct				= @is_ct
			   ,updated_by			= @user_id
			   ,updated_date		= DATEADD(HOUR, 8, GETUTCDATE())
	     WHERE client_id = @client_id;
END;

--[dbo].[clients_upd] @client_id=null, @client_name='test'