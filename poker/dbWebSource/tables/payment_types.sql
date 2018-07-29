CREATE TABLE payment_types(
payment_type_id	INT IDENTITY(1,1)	NOT NULL
,payment_type_code	NVARCHAR(10)	NOT NULL
,payment_type	NVARCHAR(100)	NULL)