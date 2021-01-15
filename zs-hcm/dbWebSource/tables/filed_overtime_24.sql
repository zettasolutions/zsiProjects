CREATE TABLE filed_overtime_24(
ot_id	INT IDENTITY(1,1)	NOT NULL
,ot_filed_date	DATE	NULL
,ot_type_id	INT	NULL
,employee_id	INT	NULL
,ot_date	DATETIMEOFFSET	NULL
,filed_ot_hours	DECIMAL(20)	NULL
,approved_hours	DECIMAL(20)	NULL
,approved_by	INT	NULL
,approved_date	DATETIMEOFFSET	NULL
,ot_reason	TEXT(2147483647)	NULL
,approver_comment	TEXT(2147483647)	NULL
,created_by	INT	NULL
,created_date	DATETIMEOFFSET	NULL
,updated_by	INT	NULL
,updated_date	DATETIMEOFFSET	NULL)