CREATE TABLE clients(
client_Id	INT IDENTITY(1,1)	NOT NULL
,client_name	NVARCHAR(200)	NOT NULL
,country_code	NVARCHAR(100)	NULL
,state_code	NVARCHAR(100)	NULL
,city_code	NVARCHAR(100)	NULL
,address	NVARCHAR(200)	NOT NULL
,client_number	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NULL
,request_no	INT	NULL
,client_image	NVARCHAR(200)	NULL
,parent_client_id	INT	NULL
,style_css	NVARCHAR(MAX)	NULL
,contact_name	NVARCHAR(100)	NULL
,mobile_no	NVARCHAR(100)	NULL
,last_name	NVARCHAR(100)	NULL
,first_name	NVARCHAR(100)	NULL
,middle_name	NVARCHAR(100)	NULL
,name_suffix	NVARCHAR(100)	NULL
,mobile_no1	NVARCHAR(100)	NULL
,mobile_no2	NVARCHAR(100)	NULL
,landline_no	NVARCHAR(100)	NULL
,email_add	NVARCHAR(100)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	NCHAR(20)	NULL)