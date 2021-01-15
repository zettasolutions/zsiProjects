


create PROCEDURE [dbo].[create_vehicle_insurances_tbl] 
   @client_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @data_table_name VARCHAR(100);
   DECLARE @create_table_stmt NVARCHAR(max);


   SET @data_table_name = 'vehicle_insurances_' + CAST(@client_id AS VARCHAR(20));
   
    SET @create_table_stmt = 'CREATE TABLE dbo.' + @data_table_name + ' (' +
	'[vehicle_insurance_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[vehicle_id] [int] NULL,'+
	'[insurance_no] [nvarchar](50) NULL,'+
	'[insurance_date] [date] NULL,'+
	'[insurance_company_id] [int] NULL,'+
	'[expiry_date] [date] NULL,'+
	'[insurance_type_id] [int] NULL,'+
	'[insured_amount] [decimal](10, 2) NULL,'+
	'[paid_amount] [decimal](10, 2) NULL,'+
	'[created_by] [int] NULL,'+
	'[created_date] [datetime] NULL,'+
	'[updated_by] [int] NULL,'+
	'[updated_date] [datetime] NULL,'+
	'[is_posted] [char](1) NULL,'+
'CONSTRAINT [PK_'+ @data_table_name + '] PRIMARY KEY CLUSTERED 
(
	[vehicle_insurance_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
				  
     EXEC (@create_table_stmt);
END;



--[dbo].[create_vehicle_insurances_tbl] @client_id=1

