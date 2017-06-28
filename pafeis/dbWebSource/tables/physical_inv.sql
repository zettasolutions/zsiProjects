CREATE TABLE physical_inv(
physical_inv_id	INT IDENTITY(1,1)	NOT NULL
,physical_inv_no	NVARCHAR(100)	NULL
,physical_inv_date	DATETIME	NOT NULL
,organization_id	INT	NULL
,warehouse_id	INT	NOT NULL
,done_by	INT	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,status_id	INT	NULL
,status_remarks	NVARCHAR(MAX)	NULL)