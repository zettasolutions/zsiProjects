

CREATE PROCEDURE [dbo].[create_safety_problems_tbl] 
   @client_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @data_table_name VARCHAR(100);
   DECLARE @create_table_stmt NVARCHAR(max);


   SET @data_table_name = 'safety_problems_' + CAST(@client_id AS VARCHAR(20));
   
    SET @create_table_stmt = 'CREATE TABLE dbo.' + @data_table_name + ' (' +
			'[safety_report_id] [int] IDENTITY(1,1) NOT NULL,'+
			'[safety_report_date] [date] NULL,'+
			'[vehicle_id] [int] NULL,'+
			'[safety_id] [int] NULL,'+
			'[comments] [nvarchar](1000) NULL,'+
			'[reported_by] [int] NULL,'+
			'[is_active] [char](1) NULL,'+
			'[closed_date] [date] NULL,'+
			'[created_by] [int] NULL,'+
			'[created_date] [datetime] NULL,'+
			'[updated_by] [int] NULL,'+
			'[updated_date] [datetime] NULL,'+
'CONSTRAINT [PK_'+ @data_table_name + '] PRIMARY KEY CLUSTERED 
(
	[safety_report_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
				  
     EXEC (@create_table_stmt);
END;



--[dbo].[create_safety_problems_tbl] @client_id=1

