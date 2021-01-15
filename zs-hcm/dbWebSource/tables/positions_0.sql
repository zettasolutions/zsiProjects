CREATE TABLE positions_0(
position_id	INT IDENTITY(1,1)	NOT NULL
,position_title	NVARCHAR(100)	NULL
,position_desc	VARCHAR(200)	NULL
,work_desc	TEXT(2147483647)	NULL
,level_no	INT	NULL
,basic_pay	DECIMAL(20)	NULL
,hourly_rate	DECIMAL(20)	NULL
,daily_rate	DECIMAL(20)	NULL
,created_by	INT	NULL
,created_date	DATETIMEOFFSET	NULL
,updated_by	INT	NULL
,updated_date	DATETIMEOFFSET	NULL)