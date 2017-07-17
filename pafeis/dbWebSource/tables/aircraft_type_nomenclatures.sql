CREATE TABLE aircraft_type_nomenclatures(
aircraft_type_nomenclature_id	INT IDENTITY(1,1)	NOT NULL
,aircraft_type_id	INT	NOT NULL
,item_code_id	INT	NOT NULL
,aircraft_type_nomenclature_pid	INT	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)