


create PROCEDURE [dbo].[create_part_replacements_tbl] 
   @client_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @data_table_name VARCHAR(100);
   DECLARE @create_table_stmt NVARCHAR(max);


   SET @data_table_name = 'part_replacements_' + CAST(@client_id AS VARCHAR(20));
   
    SET @create_table_stmt = 'CREATE TABLE dbo.' + @data_table_name + ' (' +
		'[replacement_id] [int] IDENTITY(1,1) NOT NULL,'+
		'[pms_id] [int] NULL,'+
		'[repair_id] [int] NULL,'+
		'[seq_no] [int] NULL,'+
		'[part_id] [int] NULL,'+
		'[part_qty] [decimal](8, 2) NULL,'+
		'[unit_id] [int] NULL,'+
		'[unit_cost] [decimal](8, 2) NULL,'+
		'[is_replacement] [char](1) NULL,'+
		'[is_bnew] [char](1) NULL,'+
		'[created_by] [int] NULL,'+
		'[created_date] [datetime] NULL,'+
		'[updated_by] [int] NULL,'+
		'[updated_date] [datetime] NULL,'+
'CONSTRAINT [PK_'+ @data_table_name + '] PRIMARY KEY CLUSTERED 
(
	[replacement_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
				  
     EXEC (@create_table_stmt);
END;



--[dbo].[create_part_replacements_tbl] @client_id=1

