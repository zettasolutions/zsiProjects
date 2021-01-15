CREATE TYPE vehicles_tt AS TABLE(
vehicle_id	INT	NULL
,is_edited	VARCHAR(1)	NULL
,vehicle_plate_no	NVARCHAR(100)	NULL
,vehicle_maker_id	INT	NULL
,conduction_no	NVARCHAR(100)	NULL
,chassis_no	NVARCHAR(100)	NULL
,engine_no	NVARCHAR(100)	NULL
,date_acquired	DATE	NULL
,exp_registration_date	DATE	NULL
,exp_insurance_date	DATE	NULL
,franchise_exp_date	DATE	NULL
,loan_bank_id	INT	NULL
,loan_amount	DECIMAL(20)	NULL
,dp_amount	DECIMAL(20)	NULL
,monthly_amort	DECIMAL(20)	NULL
,years_amort	INT	NULL
,start_date_amort	DATE	NULL
,odometer_reading	INT	NULL
,is_active	CHAR(1)	NULL
,status_id	INT	NULL
,hash_key	NVARCHAR(0)	NULL)