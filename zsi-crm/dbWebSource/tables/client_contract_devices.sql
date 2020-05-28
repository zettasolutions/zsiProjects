CREATE TABLE client_contract_devices(
client_contract_device_id	INT IDENTITY(1,1)	NOT NULL
,subscripton_no	NVARCHAR(40)	NULL
,client_contract_id	INT	NOT NULL
,device_id	INT	NULL
,unit_assignment	NVARCHAR(40)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)