CREATE TABLE payroll_details_26(
payroll_detail_id	INT IDENTITY(1,1)	NOT NULL
,payroll_id	INT	NOT NULL
,employee_id	INT	NOT NULL
,basic_pay	DECIMAL(20)	NOT NULL
,sss_amount	DECIMAL(20)	NULL
,philhealth_amount	DECIMAL(20)	NULL
,hdmf_amount	DECIMAL(20)	NULL
,tax_amount	DECIMAL(20)	NULL
,ca_amount	DECIMAL(20)	NULL
,loan_amount	DECIMAL(20)	NULL
,coop_contribution_amount	DECIMAL(20)	NULL
,overtime_reg_amount	DECIMAL(20)	NOT NULL
,overtime_special_amount	DECIMAL(20)	NOT NULL
,bonus_amount	DECIMAL(20)	NULL
,bonus13_amount	DECIMAL(20)	NULL
,ded_absences_amount	DECIMAL(20)	NULL
,ded_tardy_amount	DECIMAL(20)	NULL)