CREATE TABLE vehicle_repairs_1(
repair_id	INT IDENTITY(1,1)	NOT NULL
,repair_date	DATE	NULL
,pms_type_id	INT	NULL
,vehicle_id	INT	NULL
,odo_reading	INT	NULL
,repair_amount	DECIMAL(12)	NULL
,repair_location	NVARCHAR(100)	NULL
,service_amount	DECIMAL(12)	NULL
,total_repair_amount	DECIMAL(12)	NULL
,comment	NTEXT(2147483646)	NULL
,status_id	INT	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,is_posted	CHAR(1)	NULL)