CREATE TABLE sc_entries(
entry_id	INT IDENTITY(1,1)	NOT NULL
,item_code_id	INT	NOT NULL
,doc_no	NVARCHAR(100)	NOT NULL
,tran_type	NVARCHAR(100)	NOT NULL
,tran_date	DATE	NOT NULL
,tran_qty	FLOAT(8)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)