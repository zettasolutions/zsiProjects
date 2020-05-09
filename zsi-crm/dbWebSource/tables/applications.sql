CREATE TABLE applications(
app_id	INT IDENTITY(1,1)	NOT NULL
,app_code	NCHAR(20)	NULL
,app_name	NVARCHAR(100)	NULL
,app_desc	NTEXT(2147483646)	NULL
,monthly_rate	DECIMAL(12)	NULL)