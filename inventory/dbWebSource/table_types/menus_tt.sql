CREATE TYPE menus_tt AS TABLE(
menu_id	INT	NULL
,pmenu_id	INT	NULL
,menu_name	NVARCHAR(200)	NULL
,page_id	INT	NULL
,parameters	NVARCHAR(200)	NULL
,seq_no	INT	NULL
,is_default	NVARCHAR(2)	NULL)