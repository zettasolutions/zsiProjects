CREATE TABLE issuance_directive_detail(
issuance_directive_detail_id	INT IDENTITY(1,1)	NOT NULL
,issuance_directive_id	INT	NOT NULL
,item_id	INT	NOT NULL
,aircraft_id	INT	NOT NULL
,unit_of_measure_id	INT	NOT NULL
,quantity	DECIMAL(20)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)