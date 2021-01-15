CREATE TABLE shifts_26(
shift_id	INT IDENTITY(1,1)	NOT NULL
,shift_code	NVARCHAR(20)	NULL
,shift_title	NVARCHAR(100)	NULL
,monday	INT	NULL
,tuesday	INT	NULL
,wednesday	INT	NULL
,thursday	INT	NULL
,friday	INT	NULL
,saturday	INT	NULL
,sunday	INT	NULL
,no_hours	DECIMAL(20)	NULL
,from_time_in	TIME(32)	NULL
,to_time_in	TIME(32)	NULL)