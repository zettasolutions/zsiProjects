
CREATE PROCEDURE [dbo].[create_filed_overtime_tbl](
 @client_id INT
)
AS
BEGIN
   DECLARE @stmt NVARCHAR(MAX)
   SET @stmt= 'CREATE TABLE [dbo].[filed_overtime_' + cast(@client_id AS VARCHAR(20)) + '](' +
	'[ot_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[ot_filed_date] [date] NULL,'+
	'[ot_type_id] [int] NULL,'+
	'[employee_id] [int] NULL,'+
	'[ot_date] [datetimeoffset](7) NULL,'+
	'[filed_ot_hours] [decimal](18, 2) NULL,'+
	'[approved_hours] [decimal](18, 2) NULL,'+
	'[approved_by] [int] NULL,'+
	'[approved_date] [datetimeoffset](7) NULL,'+
	'[ot_reason] [varchar](max) NULL,'+
	'[approver_comment] [varchar](max) NULL,'+
	'[created_by] [int] NULL,'+
	'[created_date] [datetimeoffset](7) NULL,'+
	'[updated_by] [int] NULL,'+
	'[updated_date] [datetimeoffset](7) NULL,'+
 'CONSTRAINT [PK_overtime_' + cast(@client_id AS VARCHAR(20)) + '] PRIMARY KEY CLUSTERED 
(
	[ot_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]'
EXEC(@stmt);
END;
--dbo.create_filed_overtime_tbl @client_id=1

