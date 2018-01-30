CREATE TABLE temp_organization(
user_id	INT	NULL
,location_id	INT	NULL
,part_no	NVARCHAR(200)	NULL
,national_stock_no	NVARCHAR(200)	NULL
,nomenclature	NVARCHAR(800)	NULL
,quantity	INT	NULL
,status	NVARCHAR(200)	NULL
,id	INT IDENTITY(1,1)	NOT NULL)