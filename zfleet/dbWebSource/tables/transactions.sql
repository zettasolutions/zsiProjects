CREATE TABLE transactions(
transaction_id	INT IDENTITY(1,1)	NOT NULL
,transaction_date	DATETIME	NULL
,device_id	INT	NULL
,vehicle_plate_no	NVARCHAR(100)	NULL
,pao_id	INT	NULL
,driver_id	INT	NULL
,inspector_id	INT	NULL
,route_id	INT	NULL
,from_id	INT	NULL
,to_id	INT	NULL
,no_klm	DECIMAL(20)	NULL
,no_reg	INT	NULL
,no_stu	INT	NULL
,no_sc	INT	NULL
,no_pwd	INT	NULL
,reg_amount	DECIMAL(20)	NULL
,stu_amount	DECIMAL(20)	NOT NULL
,sc_amount	DECIMAL(20)	NULL
,pwd_amount	DECIMAL(20)	NULL
,ttl_paid_amount	DECIMAL(20)	NULL)