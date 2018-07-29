CREATE TABLE members(
member_id	INT IDENTITY(1,1)	NOT NULL
,player_id	NVARCHAR(100)	NULL
,member_name	NVARCHAR(100)	NULL
,player_name	NVARCHAR(100)	NULL
,member_date	NCHAR(20)	NULL
,address	NVARCHAR(300)	NULL
,state	NVARCHAR(100)	NULL
,country	NVARCHAR(100)	NULL
,email_add	NVARCHAR(100)	NULL
,phone_no	NVARCHAR(100)	NULL
,mobile_no	NVARCHAR(100)	NULL
,is_confirmed	CHAR(1)	NULL
,confirmed_by	INT	NULL
,is_active	CHAR(1)	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)