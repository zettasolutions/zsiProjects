CREATE PROCEDURE [dbo].[create_positions_tbl](
 @client_id INT
)
AS
BEGIN
   DECLARE @stmt NVARCHAR(MAX)
   SET @stmt= 'CREATE TABLE [dbo].[positions_' + cast(@client_id AS VARCHAR(20)) + '](' +
	'[position_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[position_title] [nvarchar](50) NULL,'+
	'[position_desc] [varchar](200) NULL,'+
	'[work_desc] [varchar](max) NULL,'+
	'[level_no] [int] NULL,'+
	'[basic_pay] [decimal](18, 2) NULL,'+
	'[hourly_rate] [decimal](18, 2) NULL,'+
	'[daily_rate] [decimal](18, 2) NULL,'+
	'[created_by] [int] NULL,'+
	'[created_date] [datetimeoffset](7) NULL,'+
	'[updated_by] [int] NULL,'+
	'[updated_date] [datetimeoffset](7) NULL,'+
 'CONSTRAINT [PK_positions_'+ cast(@client_id AS VARCHAR(20)) + '] PRIMARY KEY CLUSTERED 
(
	[position_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]'
EXEC(@stmt);
END;
-- [dbo].[create_positions_tbl]@client_id=24



