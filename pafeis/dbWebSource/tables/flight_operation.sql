CREATE TABLE flight_operation(
flight_operation_id	INT IDENTITY(1,1)	NOT NULL
,flight_operation_code	NVARCHAR(100)	NULL
,station_id	INT	NOT NULL
,flight_schedule_date	DATETIME	NOT NULL
,unit_id	INT	NULL
,aircraft_id	INT	NOT NULL
,pilot_id	INT	NOT NULL
,co_pilot_id	INT	NULL
,ms_essential	NVARCHAR(100)	NULL
,itinerary	NVARCHAR(1000)	NOT NULL
,ms_category_id	INT	NULL
,ms_type_id	INT	NULL
,ms_detail_id	INT	NULL
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
,no_cycles	INT	NULL
,remarks	NTEXT(2147483646)	NULL
,status_id	INT	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,total_hours	DECIMAL(12)	NULL)