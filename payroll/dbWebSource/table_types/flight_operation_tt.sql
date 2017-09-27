CREATE TYPE flight_operation_tt AS TABLE(
flight_operation_id	INT	NULL
,is_edited	CHAR(1)	NULL
,flight_operation_code	NVARCHAR(100)	NULL
,station_id	INT	NULL
,flight_schedule_date	DATETIME	NOT NULL
,unit_id	INT	NULL
,aircraft_id	INT	NULL
,no_cycles	INT	NULL
,ms_category_id	INT	NULL
,ms_type_id	INT	NULL
,ms_detail_id	INT	NULL
,ms_essential	NVARCHAR(100)	NULL
,itinerary	NVARCHAR(1000)	NULL
,flt_cond	NVARCHAR(20)	NULL
,sort	INT	NULL
,pax_mil	INT	NULL
,pax_civ	INT	NULL
,fnt_mil	INT	NULL
,fnt_civ	INT	NULL
,cargo	DECIMAL(20)	NULL
,gas_up_loc	NVARCHAR(100)	NULL
,gas_up	DECIMAL(12)	NULL
,gas_bal	DECIMAL(12)	NULL
,status_id	INT	NULL
,remarks	NVARCHAR(0)	NULL
,page_process_action_id	INT	NULL)