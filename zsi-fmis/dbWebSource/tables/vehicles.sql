CREATE TABLE vehicles(
vehicle_id	INT IDENTITY(1,1)	NOT NULL
,company_id	INT	NULL
,vehicle_plate_no	NVARCHAR(100)	NULL
,conduction_no	NVARCHAR(100)	NULL
,chassis_no	NVARCHAR(100)	NULL
,engine_no	NVARCHAR(100)	NULL
,date_acquired	DATE	NULL
,exp_registration_date	DATE	NULL
,exp_insurance_date	DATE	NULL
,vehicle_maker_id	INT	NULL
,odometer_reading	INT	NULL
,route_id	INT	NULL
,vehicle_type_id	INT	NULL
,vehicle_img_filename	NVARCHAR(150)	NULL
,is_active	CHAR(1)	NULL
,status_id	INT	NULL
,hash_key	NTEXT(2147483646)	NULL
,or_no	INT	NULL
,franchise_exp_date	DATE	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,loan_bank_id	INT	NULL
,loan_amount	DECIMAL(20)	NULL
,dp_amount	DECIMAL(20)	NULL
,monthly_amort	DECIMAL(20)	NULL
,years_amort	INT	NULL
,start_date_amort	DATE	NULL)