CREATE procedure [dbo].[client_contracts_upd](
   @client_contract_id  int=null
  ,@client_id int
  ,@contract_no nvarchar(50)
  ,@contract_date date
  ,@contract_term_id int= null
  ,@activation_date date 
  ,@expiry_date date=null
  ,@plan_id int=null
  ,@plan_qty int=null
  ,@srp_amount decimal(10,2)=null
  ,@dp_amount decimal(10,2)=null
  ,@less_dp_amount decimal(10,2)=null
  ,@total_amort_amount decimal(10,2)=null
  ,@monthly_amort_amount decimal(10,2)=null
  ,@is_active varchar(1)='Y'
  ,@is_edited char(1)='N'
  ,@user_id int
  ,@id				INT=NULL OUTPUT 
)
as
BEGIN
   SET NOCOUNT ON
   SET @id = @client_contract_id
	 IF ISNULL(@client_contract_id,0)=0 
	    AND ISNULL(@client_id,0)<>0
		AND ((ISNULL(@plan_id,0)<>0 AND ISNULL(@plan_qty,0) >0)) 
		BEGIN
		INSERT INTO dbo.client_contracts
		 (
		  client_id
		 ,contract_no
		 ,contract_date
		 ,contract_term_id
		 ,activation_date
		 ,expiry_date
		 ,plan_id
		 ,plan_qty
		 ,srp_amount
		 ,dp_amount
		 ,less_dp_amount
		 ,total_amort_amount
		 ,monthly_amort_amount
		 ,is_active
		 ,created_by
		 ,created_date
		 ) VALUES
		 (
		  @client_id
		 ,@contract_no
		 ,@contract_date
		 ,@contract_term_id
		 ,@activation_date
		 ,@expiry_date
		 ,@plan_id
		 ,@plan_qty
		 ,@srp_amount
		 ,@dp_amount
		 ,@less_dp_amount
		 ,@total_amort_amount
		 ,@monthly_amort_amount
		 ,@is_active
		 ,@user_id
		 ,DATEADD(HOUR, 8, GETUTCDATE())
		 ) 
		 SET @id = @@IDENTITY
	END
	ELSE
	   UPDATE dbo.client_contracts SET
			    client_id					= @client_id
				,contract_no				= @contract_no
				,contract_date				= @contract_date
				,contract_term_id			= @contract_term_id
				,activation_date			= @activation_date
				,expiry_date				= @expiry_date
				,plan_id					= @plan_id
				,plan_qty					= @plan_qty
				,srp_amount					= @srp_amount
				,dp_amount					= @dp_amount
				,less_dp_amount				= @less_dp_amount
				,total_amort_amount			= @total_amort_amount
				,monthly_amort_amount		= @monthly_amort_amount
				,is_active					= @is_active
			    ,updated_by		   	        = @user_id
			    ,updated_date		        = DATEADD(HOUR, 8, GETUTCDATE())
		   WHERE client_contract_id = @client_contract_id 
   		     AND ISNULL(@client_id,0)<>0
		     AND ((ISNULL(@plan_id,0)<>0 AND ISNULL(@plan_qty,0) >0)) 
			 AND @is_edited = 'Y';

RETURN @id;
END;
