
CREATE PROCEDURE [dbo].[create_refuel_transactions_tbl] 
   @client_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @data_table_name VARCHAR(100);
   DECLARE @create_table_stmt NVARCHAR(max);


   SET @data_table_name = 'refuel_transactions_' + CAST(@client_id AS VARCHAR(20));
   
    SET @create_table_stmt = 'CREATE TABLE dbo.' + @data_table_name + ' (' +
	'[refuel_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[doc_no] [nvarchar](50) NULL,'+
	'[doc_date] [date] NULL,'+
	'[vehicle_id] [int] NULL,'+
	'[driver_id] [int] NULL,'+
	'[pao_id] [int] NULL,'+
	'[odo_reading] [int] NULL,'+
	'[gas_station_id] [int] NULL,'+
	'[no_liters] [decimal](18, 2) NULL,'+
	'[unit_price] [decimal](18, 2) NULL,'+
	'[refuel_amount] [decimal](18, 2) NULL,'+
	'[created_by] [int] NULL,'+
	'[created_date] [datetime] NULL,'+
	'[updated_by] [int] NULL,'+
	'[updated_date] [datetime] NULL,'+
	'[is_posted] [char](1) NULL,'+
'CONSTRAINT [PK_'+ @data_table_name + '] PRIMARY KEY CLUSTERED 
(
	[refuel_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
				  
     EXEC (@create_table_stmt);
END;



--[dbo].[create_refuel_transactions_tbl] @client_id=1

