CREATE PROCEDURE [dbo].[vehicle_upd]
(
    @tt    vehicles_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
			 company_id			= b.company_id	
	   	    ,vehicle_plate_no	= b.vehicle_plate_no	
			,route_id			= b.route_id
			,hash_key			= b.hash_key
			,vehicle_type_id	= b.vehicle_type_id
			,transfer_type_id	= b.transfer_type_id
			,bank_id			= b.bank_id
			,transfer_no		= b.transfer_no
			,account_name		= b.account_name
			,is_active			= b.is_active		
	   	    ,updated_by			= @user_id
			,updated_date		= GETDATE()
       FROM dbo.vehicles a INNER JOIN @tt b
	     ON a.vehicle_id = b.vehicle_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO vehicles(
         company_id
		,vehicle_plate_no
		,route_id
		,hash_key
		,vehicle_type_id
		,transfer_type_id
		,bank_id
		,transfer_no
		,account_name
		,is_active
		,created_by
		,created_date
    )
	SELECT 
		 company_id
		,vehicle_plate_no
		,route_id
		,newid()
		,vehicle_type_id
		,transfer_type_id
		,bank_id
		,transfer_no
		,account_name
		,is_active	
	    ,@user_id
	    ,GETDATE()
	FROM @tt 
	WHERE vehicle_id IS NULL
	AND ISNULL(vehicle_plate_no,'') <>''
	AND ISNULL(company_id,0) <>0
