CREATE TYPE shifts_tt AS TABLE(
shift_id	INT	NULL
,is_edited	CHAR(1)	NULL
,shift_code	NVARCHAR(10)	NULL
,shift_title	NVARCHAR(20)	NULL
,monday	INT	NULL
,tuesday	INT	NULL
,wednesday	INT	NULL
,thursday	INT	NULL
,friday	INT	NULL
,saturday	INT	NULL
,sunday	INT	NULL
,no_hours	DECIMAL(20)	NULL
,from_time_in	TIME(12)	NULL
,to_time_in	TIME(12)	NULL)