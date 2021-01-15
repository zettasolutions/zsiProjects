CREATE TABLE filed_leaves_25(
leave_id	INT IDENTITY(1,1)	NOT NULL
,employee_id	INT	NULL
,leave_type_id	INT	NULL
,filed_date	DATE	NULL
,leave_date	DATETIMEOFFSET	NULL
,filed_hours	DECIMAL(20)	NULL
,approved_hours	DECIMAL(20)	NULL
,is_approved	CHAR(1)	NULL
,is_approved_by	INT	NULL
,is_approved_date	DATETIMEOFFSET	NULL
,leave_reason	TEXT(2147483647)	NULL
,approver_comment	TEXT(2147483647)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)