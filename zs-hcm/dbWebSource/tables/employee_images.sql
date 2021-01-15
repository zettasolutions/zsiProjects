CREATE TABLE employee_images(
image_id	INT IDENTITY(1,1)	NOT NULL
,id	INT	NOT NULL
,file_name	VARCHAR(50)	NULL
,file_content	IMAGE(2147483647)	NULL)