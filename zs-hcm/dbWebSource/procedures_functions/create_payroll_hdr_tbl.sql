
CREATE PROCEDURE [dbo].[create_payroll_hdr_tbl](
 @client_id INT
)
AS
BEGIN
   DECLARE @stmt NVARCHAR(MAX)
   SET @stmt= 'CREATE TABLE [dbo].[payroll_hdr_' + cast(@client_id AS VARCHAR(20)) + '](' +
	'[pay_period_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[period_date_from] [date] NULL,'+
	'[period_date_to] [date] NULL,'+
	'[pay_type_id] [int] NULL,'+
	'[status_id] [int] NULL,'+
	'[created_by] [int] NULL,'+
	'[created_date] [date] NULL,'+
 'CONSTRAINT [PK_payroll_hdr_' + cast(@client_id AS VARCHAR(20)) + '] PRIMARY KEY CLUSTERED 
(
	[pay_period_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
EXEC(@stmt);
END;
--dbo.create_filed_overtime_tbl @client_id=1

