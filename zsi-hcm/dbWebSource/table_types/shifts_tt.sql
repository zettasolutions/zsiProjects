CREATE TYPE shifts_tt AS TABLE(
shift_id	INT	NULL
,is_edited	CHAR(1)	NULL
,shift_code	NVARCHAR(10)	NULL
,shift_title	NVARCHAR(20)	NULL
,monday	CHAR(1)	NULL
,tuesday	CHAR(1)	NULL
,wednesday	CHAR(1)	NULL
,thursday	CHAR(1)	NULL
,friday	CHAR(1)	NULL
,saturday	CHAR(1)	NULL
,sunday	CHAR(1)	NULL
,no_hours	DECIMAL(20)	NULL
,from_time_in	TIME(12)	NULL
,to_time_in	TIME(12)	NULL)