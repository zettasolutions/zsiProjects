CREATE TABLE aircraft_type(
aircraft_type_id	INT IDENTITY(1,1)	NOT NULL
,aircraft_type	NVARCHAR(1000)	NOT NULL
,manufacturer_id	INT	NOT NULL
,origin_id	INT	NOT NULL
,aircraft_class_id	INT	NOT NULL
,aircraft_role_id	INT	NOT NULL
,introduced_year	VARCHAR(4)	NULL
,in_service	INT	NULL
,note	NVARCHAR(2000)	NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)