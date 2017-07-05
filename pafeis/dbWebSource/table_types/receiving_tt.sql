CREATE TYPE receiving_tt AS TABLE(
receiving_id	INT	NULL
,is_edited	CHAR(1)	NULL
,receiving_no	NVARCHAR(60)	NULL
,doc_no	NVARCHAR(100)	NULL
,doc_date	DATETIME	NULL
,status_id	INT	NULL
,received_by	INT	NULL
,received_date	DATETIME	NULL
,dealer_id	INT	NULL
,issuance_warehouse_id	INT	NULL
,aircraft_id	INT	NULL
,procurement_id	INT	NULL
,donor	NVARCHAR(200)	NULL
,supply_source_id	INT	NULL
,status_remarks	NVARCHAR(0)	NULL
,receiving_type	NVARCHAR(40)	NULL
,page_process_action_id	INT	NULL)