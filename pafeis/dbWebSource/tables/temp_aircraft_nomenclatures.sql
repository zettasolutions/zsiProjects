CREATE TABLE temp_aircraft_nomenclatures(
user_id	INT	NULL
,aircraft_code	NVARCHAR(100)	NULL
,part_no	NVARCHAR(100)	NULL
,serial_no	NVARCHAR(40)	NULL
,parent_serial_no	NVARCHAR(100)	NULL
,remaining_time	NVARCHAR(100)	NULL
,status	NVARCHAR(100)	NULL
,nomenclature	NVARCHAR(200)	NULL
,manufacturer	NVARCHAR(200)	NULL
,dealer	NVARCHAR(100)	NULL
,procurement_source	NVARCHAR(100)	NULL
,id	INT IDENTITY(1,1)	NOT NULL)