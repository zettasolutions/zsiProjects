CREATE TABLE pao_remit_dates(
id	INT IDENTITY(1,1)	NOT NULL
,remit_date	DATETIME	NULL
,company_code	NVARCHAR(20)	NULL
,pao_id	INT	NULL
,created_by	INT	NULL)