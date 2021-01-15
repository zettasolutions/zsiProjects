
CREATE PROCEDURE [dbo].[create_filed_leaves_tbl](
 @client_id INT
)
AS
BEGIN
   DECLARE @stmt NVARCHAR(MAX)
   SET @stmt= 'CREATE TABLE [dbo].[filed_leaves_' + cast(@client_id AS VARCHAR(20)) + '](' +
	'[leave_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[employee_id] [int] NULL,'+
	'[leave_type_id] [int] NULL,'+
	'[filed_date] [date] NULL,'+
	'[leave_date] [datetimeoffset](7) NULL,'+
	'[filed_hours] [decimal](18, 2) NULL,'+
	'[approved_hours] [decimal](18, 2) NULL,'+
	'[is_approved] [char](1) NULL,'+
	'[is_approved_by] [int] NULL,'+
	'[is_approved_date] [datetimeoffset](7) NULL,'+
	'[leave_reason] [varchar](max) NULL,'+
	'[approver_comment] [varchar](max) NULL,'+
	'[created_by] [int] NULL,'+
	'[created_date] [date] NULL,'+
	'[updated_by] [int] NULL,'+
	'[updated_date] [date] NULL,'+
 'CONSTRAINT [PK_leaves_' + cast(@client_id AS VARCHAR(20)) + '] PRIMARY KEY CLUSTERED 
(
	[leave_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]'
EXEC(@stmt);
END;

--dbo.create_filed_leaves_tbl @client_id=1



