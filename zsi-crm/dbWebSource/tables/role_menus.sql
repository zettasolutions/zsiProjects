CREATE TABLE role_menus(
role_menu_id	INT IDENTITY(1,1)	NOT NULL
,role_id	INT	NOT NULL
,menu_id	INT	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIMEOFFSET	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIMEOFFSET	NULL)