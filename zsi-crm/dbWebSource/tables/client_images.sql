CREATE TABLE client_images(
img_id	INT IDENTITY(1,1)	NOT NULL
,client_id	INT	NULL
,company_logo	IMAGE(2147483647)	NULL
,mayor_permit_img	IMAGE(2147483647)	NULL
,bir_img	IMAGE(2147483647)	NULL
,sec_dti_img	IMAGE(2147483647)	NULL)