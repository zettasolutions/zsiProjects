
CREATE PROCEDURE [dbo].[createClientRequestTable](
  @client_id INT
)
AS
BEGIN
DECLARE @stmt NVARCHAR(MAX);
SET @stmt = 'CREATE TABLE [dbo].[data_' + cast(@client_id AS VARCHAR(20)) + '_requests](
	[request_id] [int] IDENTITY(1,1) NOT NULL,
	[request_no] [nvarchar](50) NULL,
	[app_id] [int] NULL,
	[request_desc] [nvarchar](max) NULL,
	[priority_level] [nchar](1) NULL,
	[process_id] [int] NULL,
	[status_id] [int] NULL,
	[remarks] [nvarchar](max) NULL,
	[created_by] [int] NULL,
	[created_date] [date] NULL,
	[updated_date] [datetime] NULL,	[updated_by] [int] NULL,

 CONSTRAINT [PK_data_' + cast(@client_id AS VARCHAR(20)) + 'requests] PRIMARY KEY CLUSTERED 
(
	[request_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'

EXEC(@stmt);
END;



