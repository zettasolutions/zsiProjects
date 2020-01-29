CREATE TABLE consumers(
consumer_id	INT IDENTITY(1,1)	NOT NULL
,hash_key	NVARCHAR(100)	NOT NULL
,is_active	CHAR(1)	NOT NULL
,first_name	NVARCHAR(200)	NOT NULL
,middle_name	NVARCHAR(200)	NULL
,last_name	NVARCHAR(200)	NOT NULL
,address	NVARCHAR(600)	NULL
,credit_amount	DECIMAL(14)	NOT NULL
,email	NVARCHAR(600)	NOT NULL
,password	NVARCHAR(100)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)