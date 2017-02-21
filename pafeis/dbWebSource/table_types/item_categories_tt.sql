CREATE TYPE item_categories_tt AS TABLE(
item_cat_id	INT	NULL
,is_edited	CHAR(1)	NULL
,seq_no	INT	NULL
,item_cat_code	VARCHAR(15)	NULL
,item_cat_name	VARCHAR(50)	NULL
,parent_item_cat_id	INT	NULL
,is_active	CHAR(1)	NULL
,with_serial	CHAR(1)	NULL)