CREATE PROCEDURE [dbo].[create_dtr_tbl](
 @client_id INT
)
AS
BEGIN
   DECLARE @stmt NVARCHAR(MAX)
   SET @stmt= 'CREATE TABLE [dbo].[dtr_' + cast(@client_id AS VARCHAR(20)) + '](' +
	'[id] [int] IDENTITY(1,1) NOT NULL,'+
	'[client_id] [int] NULL,'+
	'[employee_id] [int] NULL,'+
	'[shift_id] [int] NULL,'+
	'[shift_hours] [decimal](18, 2) NULL,'+
	'[dtr_date] [date] NULL,'+
	'[in_device_id] [int] NULL,'+
	'[dt_in] [datetime] NULL,'+
	'[out_device_id] [int] NULL,'+
	'[dt_out] [datetime] NULL,'+
	'[reg_hours] [decimal](18, 2) NULL,'+
	'[nd_hours] [decimal](18, 2) NULL,'+
	'[odt_in] [datetime] NULL,'+
	'[odt_out] [datetime] NULL,'+
	'[reg_ot_hrs] [decimal](18, 2) NULL,'+
	'[nd_ot_hours] [decimal](18, 2) NULL,'+
	'[rd_ot_hours] [decimal](18, 2) NULL,'+
	'[rhd_ot_hours] [decimal](18, 2) NULL,'+
	'[shd_ot_hours] [decimal](18, 2) NULL,'+
	'[leave_type_id] [int] NULL,'+
	'[leave_hours] [decimal](18, 2) NULL,'+
	'[leave_hours_wpay] [decimal](18, 2) NULL,'+
 'CONSTRAINT [PK_dtr_' + cast(@client_id AS VARCHAR(20)) + '] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
EXEC(@stmt);
END;

--dbo.create_dtr_tbl @client_id=1