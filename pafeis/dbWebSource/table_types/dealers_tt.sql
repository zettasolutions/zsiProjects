CREATE TYPE dealers_tt AS TABLE(
dealer_id	INT	NULL
,dealer_name	VARCHAR(300)	NULL
,full_address	NVARCHAR(2000)	NULL
,contact_no	NVARCHAR(30)	NULL
,email_address	NVARCHAR(600)	NULL
,contact_person	VARCHAR(300)	NULL
,is_local	CHAR(1)	NULL
,is_active	CHAR(1)	NULL)