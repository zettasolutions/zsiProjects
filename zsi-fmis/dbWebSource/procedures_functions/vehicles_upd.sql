CREATE PROCEDURE [dbo].[vehicles_upd]
(
    @tt    vehicles_tt READONLY
   ,@user_id int
)
AS
BEGIN
    DECLARE @stmt NVARCHAR(MAX)
	
-- Update Process
               UPDATE a SET vehicle_plate_no		= b.vehicle_plate_no	
							,conduction_no			= b.conduction_no
							,chassis_no				= b.chassis_no
							,engine_no				= b.engine_no
							,date_acquired			= b.date_acquired
							,exp_registration_date	= b.exp_registration_date
							,exp_insurance_date		= b.exp_insurance_date
							,vehicle_maker_id		= b.vehicle_maker_id
							,odometer_reading		= b.odometer_reading
							,franchise_exp_date		= b.franchise_exp_date
							,loan_bank_id			= b.loan_bank_id
							,loan_amount			= b.loan_amount
							,dp_amount				= b.dp_amount
							,monthly_amort			= b.monthly_amort
							,years_amort			= b.years_amort
							,start_date_amort		= b.start_date_amort
							,is_active				= b.is_active
							,status_id				= b.status_id
							,hash_key				= b.hash_key	
	   						,updated_by				= @user_id
							,updated_date			= DATEADD(HOUR,8,GETUTCDATE())
					   FROM dbo.vehicles a INNER JOIN @tt b
						 ON a.vehicle_id = b.vehicle_id
						 WHERE (isnull(b.is_edited,'N')='Y');


END;


