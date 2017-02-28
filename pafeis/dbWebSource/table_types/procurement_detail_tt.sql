CREATE TYPE procurement_detail_tt AS TABLE(
procurement_detail_id	INT	NULL
,is_edited	CHAR(1)	NULL
,procurement_id	INT	NULL
,item_no	INT	NULL
,item_code_id	INT	NULL
,unit_of_measure_id	INT	NULL
,quantity	INT	NULL
,unit_price	DECIMAL(20)	NULL
,amount	DECIMAL(20)	NULL
,total_delivered_quantity	INT	NULL
,balance_quantity	INT	NULL)