CREATE TYPE user_roles_tt AS TABLE(
user_role_id	INT	NULL
,is_deleted	CHAR(1)	NULL
,app_user_id	INT	NULL
,role_id	INT	NULL)