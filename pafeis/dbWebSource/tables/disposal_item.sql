CREATE TABLE disposal_item(
disposal_item_id	INT IDENTITY(1,1)	NOT NULL
,item_id	INT	NOT NULL
,unit_of_measure_id	INT	NOT NULL
,quantity	DECIMAL(20)	NOT NULL
,authority_ref	NVARCHAR(2000)	NULL
,remarks	NVARCHAR(6000)	NULL
,status_id	INT	NOT NULL
,disposed_by	INT	NOT NULL
,disposed_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)