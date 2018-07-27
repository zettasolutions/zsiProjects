

 CREATE PROCEDURE [dbo].[request_attachments_sel](
	 @request_id		INT
	,@client_id         INT
	,@user_id           INT
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @table NVARCHAR(100)
DECLARE @stmt NVARCHAR(MAX)

    SET @table = CONCAT('dbo.data_',@client_id,'_request_attachments');
    SET @stmt = 'SELECT request_attachment_id, request_id, attachment_name, file_name FROM ' + @table +
				' WHERE request_id=' + CAST(@request_id AS NVARCHAR(100)) + '';
    EXEC(@stmt);

END;

--[request_attachments_sel] @user_id=95,@request_id=6,@client_id=2
