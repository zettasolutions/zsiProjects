CREATE TYPE device_models_tt AS TABLE(
device_model_id	INT	NULL
,is_edited	VARCHAR(1)	NULL
,brand_id	INT	NULL
,model_no	NVARCHAR(40)	NULL
,model_name	NVARCHAR(100)	NULL
,model_desc	NVARCHAR(0)	NULL
,is_active	CHAR(1)	NULL)