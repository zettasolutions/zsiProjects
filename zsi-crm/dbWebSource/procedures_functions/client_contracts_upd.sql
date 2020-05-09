CREATE procedure [dbo].[client_contracts_upd](
   @client_contract_id  int=null
  ,@client_id int=null
  ,@contract_no nvarchar(50)=null
  ,@contract_date date=null
  ,@expiry_date date=null
  ,@no_subscriptions int=null
  ,@plan_id int=null
  ,@is_active varchar(1)='Y'
  ,@user_id int
)
as
BEGIN
   SET NOCOUNT ON
	 IF ISNULL(@client_contract_id,0)=0
		INSERT INTO dbo.client_contracts
		 (
		  client_id
		 ,contract_no
		 ,contract_date
		 ,expiry_date
		 ,no_subscriptions
		 ,plan_id
		 ,is_active
		 ,created_by
		 ,created_date
		 ) VALUES
		 (
		  @client_id
		 ,@contract_no
		 ,@contract_date
		 ,@expiry_date
		 ,@no_subscriptions
		 ,@plan_id
		 ,@is_active
		 ,@user_id
		 ,GETDATE()
		 ) 
	ELSE
	   UPDATE dbo.client_contracts SET
			    client_id			= @client_id
			   ,contract_no			= @contract_no
			   ,contract_date		= @contract_date
			   ,expiry_date			= @expiry_date
			   ,no_subscriptions    = @no_subscriptions
  			   ,plan_id				= @plan_id
			   ,is_active			= @is_active
			   ,updated_by			= @user_id
			   ,updated_date		= GETDATE();
END;
