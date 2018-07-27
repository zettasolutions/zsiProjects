

CREATE PROCEDURE [dbo].[request_upd](
	 @request_id		INT=NULL
	,@client_id			INT
	,@app_id			INT
	,@request_desc		NVARCHAR(MAX)
	,@priority_level	INT = NULL
	,@process_id        INT
	,@process_status_id INT
	,@status_id         INT
	,@next_process_id   INT = NULL
	,@remarks           NVARCHAR(MAX)
	,@user_id           INT
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @request_no NVARCHAR(50)
DECLARE @id INT
DECLARE @table NVARCHAR(100)
DECLARE @stmt NVARCHAR(MAX)

    SET @table = CONCAT('dbo.data_',@client_id);

	IF ISNULL(@request_id,0) = 0 
	BEGIN
	   SELECT @request_no=(ISNULL(request_no,0) + 1) FROM dbo.clients WHERE client_id=@client_id;
	   SET @stmt = 'INSERT INTO ' + @table + '_requests ' + 
	   '( request_no  
		,app_id		
   		,request_desc	
   		,priority_level
   		,process_id    
   		,status_id     
   		,remarks
		,created_by
		,created_date       
	   )
	   values
	   ( ' + cast(@request_no as varchar(20)) + 
   		 ',' + cast(@app_id as varchar(20)) +		
   		 ',''' + @request_desc + '''' +
		 ',' + cast(ISNULL(@priority_level,0) as varchar(20)) +
   		 ',iif(ISNULL(' + cast(@next_process_id as varchar(20)) + ',0) = 0, ' + 
		                  cast(@process_id as varchar(20)) + ',' + 
						  cast(@next_process_id as varchar(20)) +')' +  
   		 ',' + cast(@status_id as varchar(20)) +    
   		 ',''' + @remarks + ''',' + cast(@user_id as varchar(20)) +
		',GETDATE()
		 )';
	    PRINT @stmt;
		EXEC(@stmt);
		UPDATE dbo.clients SET request_no=@request_no WHERE client_id = @client_id;
		SET @id=@@IDENTITY;
	END;
	ELSE
	BEGIN
	SET @id = @request_id;
	SET @stmt= 'UPDATE ' + @table + '_requests ' +
	   'SET  app_id		   = ' + CAST(@app_id AS VARCHAR(20)) + 
		   ',request_desc  = ''' +  @request_desc + '''' +
		   iif(ISNULL(CAST(@priority_level AS VARCHAR(20)),'') = '', '' , ',priority_level = ' + CAST(@priority_level AS VARCHAR(20)) + '')  +
		   ',process_id     = iif(ISNULL(' + CAST(@next_process_id AS VARCHAR(20)) + ',0) = 0, ' + CAST(@process_id AS VARCHAR(20)) + ',' + CAST(@next_process_id AS VARCHAR(20)) + ')' + 
		   ',status_id      = ' + CAST(@status_id  AS VARCHAR(20)) +    
		   ',remarks        = ''' + @remarks + ''',updated_by = ' + CAST(@user_id AS VARCHAR(20)) +
		   ',updated_date   = GETDATE() ' + 
	 ' WHERE request_id = ' + CAST(@request_id AS VARCHAR(20));
	 EXEC(@stmt);
    END;
	IF ISNULL(@next_process_id,0) <> 0
	BEGIN
		SET @stmt = 'INSERT INTO ' + @table + '_request_routing ' +
		'(process_id
		,request_id
		,status_id
		,remarks
		,created_by
		,created_date
		)
		values
		(' + CAST(@process_id AS VARCHAR(20)) + 
		',' + CAST(@id AS VARCHAR(20)) +
		',' + CAST(@status_id AS VARCHAR(20)) +
		',''' + @remarks + ''',' + CAST(@user_id AS VARCHAR(20)) +
		',GETDATE())'

	    EXEC(@stmt);
	END
	RETURN @id;
END;

