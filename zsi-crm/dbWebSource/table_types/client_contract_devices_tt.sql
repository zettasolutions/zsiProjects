CREATE TYPE client_contract_devices_tt AS TABLE(
client_contract_device_id	INT	NULL
,is_edited	CHAR(1)	NULL
,subscripton_no	NVARCHAR(40)	NULL
,client_contract_id	INT	NULL
,device_id	INT	NULL
,unit_assignment	NVARCHAR(40)	NULL)