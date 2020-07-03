CREATE TYPE drivers_pao_tt AS TABLE(
user_id	INT	NULL
,is_edited	CHAR(1)	NULL
,company_id	INT	NULL
,first_name	NVARCHAR(400)	NULL
,last_name	NVARCHAR(400)	NULL
,middle_name	NVARCHAR(400)	NULL
,name_suffix	NVARCHAR(40)	NULL
,hash_key	NVARCHAR(100)	NULL
,position	NVARCHAR(100)	NULL
,transfer_type_id	INT	NULL
,bank_id	INT	NULL
,transfer_no	NCHAR(20)	NULL
,role_id	INT	NULL
,is_active	VARCHAR(1)	NULL)