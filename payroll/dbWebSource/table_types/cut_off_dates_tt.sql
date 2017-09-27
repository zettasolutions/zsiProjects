CREATE TYPE cut_off_dates_tt AS TABLE(
cut_off_id	INT	NULL
,from_date	NVARCHAR(1000)	NULL
,to_date	NVARCHAR(1000)	NULL
,is_active	NCHAR(2)	NULL)