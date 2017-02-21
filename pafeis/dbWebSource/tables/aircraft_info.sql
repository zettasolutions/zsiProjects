CREATE TABLE aircraft_info(
aircraft_info_id	INT IDENTITY(1,1)	NOT NULL
,aircraft_code	NVARCHAR(20)	NOT NULL
,aircraft_name	NVARCHAR(600)	NOT NULL
,aircraft_type_id	INT	NOT NULL
,squadron_id	INT	NOT NULL
,aircraft_time	DECIMAL(20)	NULL
,aircraft_source_id	INT	NOT NULL
,aircraft_dealer_id	INT	NOT NULL
,status_id	INT	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,item_class_id	INT	NULL)