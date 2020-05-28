CREATE TABLE device_models(
device_model_id	INT IDENTITY(1,1)	NOT NULL
,brand_id	INT	NULL
,model_no	NVARCHAR(40)	NULL
,model_name	NVARCHAR(100)	NULL
,model_desc	NTEXT(2147483646)	NULL
,srp	DECIMAL(12)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)