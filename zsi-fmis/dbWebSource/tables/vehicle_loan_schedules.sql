CREATE TABLE vehicle_loan_schedules(
vehicle_loan_sched_id	INT	NOT NULL
,vehicle_id	INT	NULL
,amort_sched_date	DATE	NULL
,amort_paid_date	DATE	NULL
,payment_ref_no	NVARCHAR(40)	NULL)