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
  ,@device_model_id int = null
  ,@device_qty int = null
  ,@device_term_id int = null
  ,@unit_assignment_type_id int=null
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
		AND ((ISNULL(@plan_id,0)<>0 AND ISNULL(@plan_qty,0) >0) 
		  OR (ISNULL(@device_model_id,0) <> 0 AND ISNULL(@device_qty,0) > 0 AND ISNULL(@device_term_id,0) <> 0)) 
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
		 ,device_model_id
		 ,device_qty
		 ,device_term_id
		 ,unit_assignment_type_id
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
		 ,@device_model_id
		 ,@device_qty
		 ,@device_term_id
		 ,@unit_assignment_type_id
		 ,@is_active
		 ,@user_id
		 ,GETDATE()
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
				,device_model_id			= @device_model_id
				,device_qty					= @device_qty
				,device_term_id				= @device_term_id
				,unit_assignment_type_id	= @unit_assignment_type_id
				,is_active					= @is_active
			    ,updated_by		   	        = @user_id
			    ,updated_date		        = GETDATE()
		   WHERE client_contract_id = @client_contract_id 
   		     AND ISNULL(@client_id,0)<>0
		     AND ((ISNULL(@plan_id,0)<>0 AND ISNULL(@plan_qty,0) >0) 
		      OR (ISNULL(@device_model_id,0) <> 0 AND ISNULL(@device_qty,0) > 0 AND ISNULL(@device_term_id,0) <> 0)) 
			 AND @is_edited = 'Y';

RETURN @id;
END;
