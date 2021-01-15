
CREATE PROCEDURE [dbo].[create_dept_sect_tbl](
 @client_id INT
)
AS
BEGIN
   DECLARE @stmt NVARCHAR(MAX)
   SET @stmt= 'CREATE TABLE [dbo].[dept_sect_' + cast(@client_id AS VARCHAR(20)) + '](' +
	'[dept_sect_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[dept_sect_code] [nvarchar](20) NULL,'+
	'[dept_sect_name] [nvarchar](50) NULL,'+
	'[dept_sect_parent_id] [int] NULL,'+
	'[is_active] [char](1) NULL,'+
	'[created_by] [int] NULL,'+
	'[created_date] [datetimeoffset](7) NULL,'+
	'[updated_by] [int] NULL,'+
	'[updated_date] [datetimeoffset](7) NULL,'+
 'CONSTRAINT [PK_departments_' + cast(@client_id AS VARCHAR(20)) + '] PRIMARY KEY CLUSTERED 
(
	[dept_sect_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
EXEC(@stmt);
END;

--[dbo].[create_dept_sect_tbl] @client_id=0