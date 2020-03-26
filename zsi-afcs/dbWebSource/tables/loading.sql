CREATE TABLE loading(
loading_id	INT IDENTITY(1,1)	NOT NULL
,load_date	DATETIME	NOT NULL
,qr_id	INT	NOT NULL
,load_amount	DECIMAL(20)	NOT NULL
,device_id	INT	NULL
,load_by	INT	NOT NULL
,remit_id	INT	NULL
,prev_qr_id	INT	NULL)