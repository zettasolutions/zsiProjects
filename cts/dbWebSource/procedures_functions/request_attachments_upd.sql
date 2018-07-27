

 CREATE PROCEDURE [dbo].[request_attachments_upd](
	 @request_attachment_id INT = null
	,@request_id		INT
	,@client_id         INT
	,@attachment_name	nvarchar(1000)
	,@file_name		    NVARCHAR(MAX)
	,@user_id           INT
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @table NVARCHAR(100)
DECLARE @stmt NVARCHAR(MAX)

    SET @table = CONCAT('dbo.data_',@client_id);

	IF ISNULL(@request_attachment_id,0) <> 0
	BEGIN
		SET @stmt = 'UPDATE ' + @table + '_request_attachments ' + 
		   'SET attachment_name=''' + @attachment_name + ''' WHERE request_attachment_id=' + CAST(@request_attachment_id AS NVARCHAR(100)) + '';
		EXEC(@stmt);
	END
	ELSE
	BEGIN
		SET @stmt = 'INSERT INTO ' + @table + '_request_attachments ' + 
		   '( request_id  
			,attachment_name		
   			,file_name	
			,created_by
			,created_date       
		   )
		   values
		   ( ' + cast(@request_id as varchar(20)) + 
   			 ',''' + @attachment_name + '''' +
   			 ',''' + @file_name + '''' + 
			 ',' + cast(@request_id as varchar(20)) + 
			',GETDATE()
			 )';
		EXEC(@stmt);
	END
END;

