



CREATE PROCEDURE [dbo].[client_contract_devices_upd]
(
    @tt    client_contract_devices_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	     subscripton_no					= b.subscripton_no	
			,client_contract_id				= b.client_contract_id
			,device_id						= b.device_id
			,unit_assignment				= b.unit_assignment
			,updated_by						= @user_id
			,updated_date					= DATEADD(HOUR, 8, GETUTCDATE())

       FROM dbo.client_contract_devices a INNER JOIN @tt b
	     ON a.client_contract_device_id = b.client_contract_device_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO client_contract_devices(
         subscripton_no
		,client_contract_id
		,device_id
		,unit_assignment
		,created_by
		,created_date
    )
	SELECT 
		 subscripton_no
		,client_contract_id
		,device_id
		,unit_assignment
		,@user_id
	    ,DATEADD(HOUR, 8, GETUTCDATE())
	FROM @tt 
	WHERE client_contract_device_id IS NULL
	AND subscripton_no IS NOT NULL
	AND client_contract_id IS NOT NULL
	AND device_id IS NOT NULL
	AND unit_assignment IS NOT NULL







