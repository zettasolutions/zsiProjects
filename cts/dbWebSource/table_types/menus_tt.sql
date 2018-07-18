CREATE TYPE menus_tt AS TABLE(
menu_id	INT	NULL
,is_edited	VARCHAR(1)	NULL
,seq_no	INT	NULL
,icon	NVARCHAR(100)	NULL
,pmenu_id	INT	NULL
,menu_name	NVARCHAR(200)	NULL
,page_id	INT	NULL
,is_default	VARCHAR(1)	NULL
,is_zsi_only	VARCHAR(1)	NULL)