
CREATE PROCEDURE [dbo].[createClientRequestAttachmentsTable](
  @client_id INT
)
AS
BEGIN
DECLARE @stmt NVARCHAR(MAX)
SET @stmt = 'CREATE TABLE [dbo].[data_' + cast(@client_id AS VARCHAR(20)) + '_request_attachments](
	[request_attachment_id] [int] IDENTITY(1,1) NOT NULL,
    [request_id] [int] NOT NULL,
	[attachment_name] [nvarchar](50) NOT NULL,
	[file_name] [nvarchar](50) NOT NULL,
	[created_by] [int] NOT NULL,
	[created_date] [datetimeoffset](7) NOT NULL,
	[updated_by] [int] NULL,
	[updated_date] [datetimeoffset](7) NULL,
 CONSTRAINT [PK_data_' + cast(@client_id AS VARCHAR(20)) + '_request_attachments] PRIMARY KEY CLUSTERED 
(
	[request_attachment_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'

EXEC(@stmt);
END;


