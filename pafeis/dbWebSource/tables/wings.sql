CREATE TABLE wings(
wing_id	INT IDENTITY(1,1)	NOT NULL
,wing_code	NVARCHAR(20)	NOT NULL
,wing_name	NVARCHAR(1000)	NOT NULL
,wing_full_address	NVARCHAR(2000)	NOT NULL
,wing_commander_id	INT	NOT NULL
,is_active	NCHAR(2)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)