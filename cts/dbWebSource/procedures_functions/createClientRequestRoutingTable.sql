

CREATE PROCEDURE [dbo].[createClientRequestRoutingTable](
  @client_id INT
)
AS
BEGIN
DECLARE @stmt NVARCHAR(MAX)
SET @stmt = 'CREATE TABLE [dbo].[data_' + cast(@client_id AS VARCHAR(20)) + '_request_routing](
	[request_routing_id] [int] IDENTITY(1,1) NOT NULL,
	[process_id] [int] NOT NULL,
	[request_id] [int] NOT NULL,
	[status_id] [int] NULL,
	[remarks] [nvarchar](max) NULL,
	[created_by] [int] NULL,
	[created_date] [date] NULL,
 CONSTRAINT [PK_data_' + cast(@client_id AS VARCHAR(20)) + '_request_routing] PRIMARY KEY CLUSTERED 
(
	[request_routing_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'

EXEC(@stmt);
END;



--dbo.createClientRequestRoutingTable @client_id=2

