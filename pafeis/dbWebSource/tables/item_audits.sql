CREATE TABLE item_audits(
item_audit_id	INT IDENTITY(1,1)	NOT NULL
,item_id	INT	NULL
,remaining_time	DECIMAL(12)	NULL
,status_id	INT	NULL
,created_by	INT	NULL
,created_date	DATE	NULL)