CREATE TABLE menus(
menu_id	INT IDENTITY(1,1)	NOT NULL
,pmenu_id	INT	NULL
,icon	NVARCHAR(100)	NULL
,menu_name	NVARCHAR(200)	NOT NULL
,seq_no	INT	NULL
,page_id	INT	NULL
,is_default	VARCHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,is_zsi_only	VARCHAR(1)	NULL)