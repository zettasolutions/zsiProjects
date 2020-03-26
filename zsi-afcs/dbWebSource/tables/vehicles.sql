CREATE TABLE vehicles(
vehicle_id	INT IDENTITY(1,1)	NOT NULL
,vehicle_plate_no	NVARCHAR(100)	NOT NULL
,route_id	INT	NOT NULL
,company_code	NVARCHAR(100)	NOT NULL
,hash_key	NVARCHAR(100)	NOT NULL
,vehicle_type_id	INT	NOT NULL
,is_active	NCHAR(2)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)