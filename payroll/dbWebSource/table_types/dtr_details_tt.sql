CREATE TYPE dtr_details_tt AS TABLE(
dtr_dtl_id	INT	NULL
,dtr_hdr_id	INT	NULL
,dtr_date	INT	NULL
,time_in	TIME(12)	NULL
,time_out	TIME(12)	NULL
,act_hours	DECIMAL(7)	NULL
,tardiness_hours	DECIMAL(7)	NULL
,ot_hours	DECIMAL(7)	NULL
,np_hours	DECIMAL(7)	NULL
,sl_wp_hours	DECIMAL(7)	NULL
,sl_wop_hours	DECIMAL(7)	NULL
,vl_wp_hours	DECIMAL(7)	NULL
,vl_wop_hours	DECIMAL(7)	NULL
,el_wp_hours	DECIMAL(7)	NULL
,el_wop_hours	DECIMAL(7)	NULL)