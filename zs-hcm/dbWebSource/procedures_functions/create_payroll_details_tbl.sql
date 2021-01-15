
CREATE PROCEDURE [dbo].[create_payroll_details_tbl](
 @client_id INT
)
AS
BEGIN
   DECLARE @stmt NVARCHAR(MAX)
   SET @stmt= 'CREATE TABLE [dbo].[payroll_details_' + cast(@client_id AS VARCHAR(20)) + '](' +
	'[payroll_detail_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[payroll_id] [int] NOT NULL,'+
	'[employee_id] [int] NOT NULL,'+
	'[basic_pay] [decimal](18, 2) NOT NULL,'+
	'[sss_amount] [decimal](18, 2) NULL,'+
	'[philhealth_amount] [decimal](18, 2) NULL,'+
	'[hdmf_amount] [decimal](18, 2) NULL,'+
	'[tax_amount] [decimal](18, 2) NULL,'+
	'[ca_amount] [decimal](18, 2) NULL,'+
	'[loan_amount] [decimal](18, 2) NULL,'+
	'[coop_contribution_amount] [decimal](18, 2) NULL,'+
	'[overtime_reg_amount] [decimal](18, 2) NOT NULL,'+
	'[overtime_special_amount] [decimal](18, 2) NOT NULL,'+
	'[bonus_amount] [decimal](18, 2) NULL,'+
	'[bonus13_amount] [decimal](18, 2) NULL,'+
	'[ded_absences_amount] [decimal](18, 2) NULL,'+
	'[ded_tardy_amount] [decimal](18, 2) NULL,'+
 'CONSTRAINT [PK_payroll_details_' + cast(@client_id AS VARCHAR(20)) + '] PRIMARY KEY CLUSTERED 
(
	[payroll_detail_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
EXEC(@stmt);
END;
--dbo.create_payroll_details_tbl @client_id=1

