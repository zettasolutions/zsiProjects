CREATE TYPE drivers_pao_tt AS TABLE(
user_id	INT	NULL
,is_edited	CHAR(1)	NULL
,first_name	NVARCHAR(400)	NULL
,last_name	NVARCHAR(400)	NULL
,hash_key	NVARCHAR(100)	NULL
,is_active	VARCHAR(1)	NULL)