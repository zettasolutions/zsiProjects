CREATE TABLE dealers(
dealer_id	INT IDENTITY(1,1)	NOT NULL
,dealer_name	VARCHAR(300)	NOT NULL
,full_address	NVARCHAR(2000)	NULL
,contact_no	NVARCHAR(30)	NULL
,email_address	NVARCHAR(600)	NULL
,contact_person	VARCHAR(300)	NULL
,is_local	CHAR(1)	NOT NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)