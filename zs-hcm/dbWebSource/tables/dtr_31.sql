CREATE TABLE dtr_31(
id	INT IDENTITY(1,1)	NOT NULL
,client_id	INT	NULL
,employee_id	INT	NULL
,shift_id	INT	NULL
,shift_hours	DECIMAL(20)	NULL
,dtr_date	DATE	NULL
,in_device_id	INT	NULL
,dt_in	DATETIME	NULL
,out_device_id	INT	NULL
,dt_out	DATETIME	NULL
,reg_hours	DECIMAL(20)	NULL
,nd_hours	DECIMAL(20)	NULL
,odt_in	DATETIME	NULL
,odt_out	DATETIME	NULL
,reg_ot_hrs	DECIMAL(20)	NULL
,nd_ot_hours	DECIMAL(20)	NULL
,rd_ot_hours	DECIMAL(20)	NULL
,rhd_ot_hours	DECIMAL(20)	NULL
,shd_ot_hours	DECIMAL(20)	NULL
,leave_type_id	INT	NULL
,leave_hours	DECIMAL(20)	NULL
,leave_hours_wpay	DECIMAL(20)	NULL)