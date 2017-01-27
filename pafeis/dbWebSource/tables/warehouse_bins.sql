CREATE TABLE warehouse_bins(
bin_id	INT IDENTITY(1,1)	NOT NULL
,warehouse_id	INT	NOT NULL
,bin_code	NVARCHAR(100)	NOT NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)