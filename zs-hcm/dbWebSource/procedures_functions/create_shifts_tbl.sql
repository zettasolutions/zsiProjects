
CREATE PROCEDURE [dbo].[create_shifts_tbl](
 @client_id INT
)
AS
BEGIN
   DECLARE @stmt NVARCHAR(MAX)
   SET @stmt= 'CREATE TABLE [dbo].[shifts_' + cast(@client_id AS VARCHAR(20)) + '](' +
	'[shift_id] [int] IDENTITY(1,1) NOT NULL,'+
	'[shift_code] [nvarchar](10) NULL,'+
	'[shift_title] [nvarchar](50) NULL,'+
	'[monday] [int] NULL,'+
	'[tuesday] [int] NULL,'+
	'[wednesday] [int] NULL,'+
	'[thursday] [int] NULL,'+
	'[friday] [int] NULL,'+
	'[saturday] [int] NULL,'+
	'[sunday] [int] NULL,'+
	'[no_hours] [decimal](18, 2) NULL,'+
	'[from_time_in] [time](7) NULL,'+
	'[to_time_in] [time](7) NULL,'+
 'CONSTRAINT [PK_shifts_' + cast(@client_id AS VARCHAR(20)) + '] PRIMARY KEY CLUSTERED 
(
	[shift_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
EXEC(@stmt);
END;



