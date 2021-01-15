

create PROCEDURE [dbo].[create_accident_transactions_tbl] 
   @client_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @data_table_name VARCHAR(100);
   DECLARE @create_table_stmt NVARCHAR(max);


   SET @data_table_name = 'accident_transactions_' + CAST(@client_id AS VARCHAR(20));
   
    SET @create_table_stmt = 'CREATE TABLE dbo.' + @data_table_name + ' (' +
	'[accident_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[accident_date] [date] NULL,'+
	'[vehicle_id] [int] NULL,'+
	'[driver_id] [int] NULL,'+
	'[pao_id] [int] NULL,'+
	'[accident_type_id] [int] NULL,'+
	'[accident_level] [char](50) NULL,'+
	'[error_type_id] [int] NULL,'+
	'[comments] [nvarchar](max) NULL,'+
	'[created_by] [int] NULL,'+
	'[created_date] [datetime] NULL,'+
	'[updated_by] [int] NULL,'+
	'[updated_date] [datetime] NULL,'+
	'[is_posted] [char](1) NULL,'+
'CONSTRAINT [PK_'+ @data_table_name + '] PRIMARY KEY CLUSTERED 
(
	[accident_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
				  
     EXEC (@create_table_stmt);
END;



--[dbo].[create_accident_transactions_tbl] @client_id=1

