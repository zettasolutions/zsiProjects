CREATE TABLE vehicle_drivers_pao_assignment(
vehicle_assignments_id	INT IDENTITY(1,1)	NOT NULL
,vehicle_id	NCHAR(20)	NULL
,driver_id	INT	NULL
,pao_id	INT	NULL
,sched_id	INT	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)