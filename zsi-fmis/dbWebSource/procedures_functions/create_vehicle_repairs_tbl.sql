

CREATE PROCEDURE [dbo].[create_vehicle_repairs_tbl] 
   @client_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @data_table_name VARCHAR(100);
   DECLARE @create_table_stmt NVARCHAR(max);


   SET @data_table_name = 'vehicle_repairs_' + CAST(@client_id AS VARCHAR(20));
   
    SET @create_table_stmt = 'CREATE TABLE dbo.' + @data_table_name + ' (' +
			'[repair_id] [int] IDENTITY(1,1) NOT NULL,'+
			'[repair_date] [date] NULL,'+
			'[pms_type_id] [int] NULL,'+
			'[vehicle_id] [int] NULL,'+
			'[odo_reading] [int] NULL,'+
			'[repair_amount] [decimal](10, 2) NULL,'+
			'[repair_location] [nvarchar](50) NULL,'+
			'[service_amount] [decimal](10, 2) NULL,'+
			'[total_repair_amount] [decimal](10, 2) NULL,'+
			'[comment] [nvarchar](max) NULL,'+
			'[status_id] [int] NULL,'+
			'[created_by] [int] NULL,'+
			'[created_date] [datetime] NULL,'+
			'[updated_by] [int] NULL,'+
			'[updated_date] [datetime] NULL,'+
			'[is_posted] [char](1) NULL,'+
'CONSTRAINT [PK_'+ @data_table_name + '] PRIMARY KEY CLUSTERED 
(
	[repair_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
				  
     EXEC (@create_table_stmt);
END;



--[dbo].[create_vehicle_repairs_tbl] @client_id=1

