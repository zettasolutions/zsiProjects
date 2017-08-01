CREATE TABLE temp_aircraft_nomenclatures(
user_id	INT	NULL
,aircraft_code	NVARCHAR(100)	NULL
,part_no	NVARCHAR(100)	NULL
,serial_no	NVARCHAR(40)	NULL
,manufacturer	NVARCHAR(100)	NULL
,dealer	NVARCHAR(100)	NULL
,supply_source	NVARCHAR(100)	NULL
,remaining_time	DECIMAL(12)	NULL
,date_issued	DATETIME	NULL
,status	NVARCHAR(100)	NULL
,item_class	NVARCHAR(100)	NULL
,parent_serial_no	NVARCHAR(100)	NULL
,id	INT IDENTITY(1,1)	NOT NULL)