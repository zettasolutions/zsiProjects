CREATE TABLE shift_codes(
shift_id	INT	NOT NULL
,shift_code	CHAR(5)	NOT NULL
,time_from	TIME(32)	NOT NULL
,time_to	TIME(32)	NOT NULL
,reg_hours	DECIMAL(11)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)