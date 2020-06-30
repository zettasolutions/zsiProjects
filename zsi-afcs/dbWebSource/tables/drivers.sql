CREATE TABLE drivers(
driver_id	INT IDENTITY(1,1)	NOT NULL
,company_id	INT	NULL
,hash_key	NVARCHAR(100)	NOT NULL
,last_name	NVARCHAR(200)	NULL
,first_name	NVARCHAR(200)	NULL
,middle_name	NVARCHAR(2)	NULL
,name_suffix	NVARCHAR(100)	NULL
,full_name	NVARCHAR(404)	NOT NULL
,img_filename	NVARCHAR(100)	NULL
,driver_academy_no	NVARCHAR(40)	NULL
,driver_license_no	NVARCHAR(40)	NULL
,driver_licence_img_filename	NVARCHAR(100)	NULL
,transfer_type_id	INT	NULL
,bank_id	INT	NULL
,transfer_no	NCHAR(20)	NULL
,is_active	VARCHAR(50)	NULL
,created_by	INT	NULL
,created_date	DATETIMEOFFSET	NULL
,updated_by	INT	NULL
,updated_date	DATETIMEOFFSET	NULL)