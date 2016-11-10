CREATE TABLE squadrons(
squadron_id	INT IDENTITY(1,1)	NOT NULL
,wing_id	INT	NOT NULL
,squadron_type_id	INT	NOT NULL
,squadron_code	NVARCHAR(20)	NOT NULL
,squadron_name	NVARCHAR(1000)	NOT NULL
,squadron_commander_id	INT	NOT NULL
,squadron_full_address	NVARCHAR(2000)	NOT NULL
,is_active	NCHAR(2)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)