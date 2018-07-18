

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

	IF ISNULL(@request_id,0) = 0 
	BEGIN
	   SELECT @request_no=(ISNULL(request_no,0) + 1) FROM dbo.clients WHERE client_id=@client_id;
	   INSERT INTO dbo.requests
	   ( request_no  
		,client_id		
		,app_id		
   		,request_desc	
   		,priority_level
   		,process_id    
   		,status_id     
   		,remarks       
	   )
	   values
	   ( @request_no 
		,@client_id		
   		,@app_id		
   		,@request_desc	
   		,@priority_level
   		,iif(ISNULL(@next_process_id,0) = 0, @process_id, @next_process_id)  
   		,@status_id     
   		,@remarks
		);
		UPDATE dbo.clients SET request_no=@request_no WHERE client_id = @client_id;
		SET @id=@@IDENTITY;
	END;
	ELSE
	BEGIN
	SET @id = @request_id;
	UPDATE dbo.requests
	   SET  app_id		   = @app_id		
		   ,request_desc   = @request_desc	
		   ,priority_level = @priority_level
		   ,process_id     = iif(ISNULL(@next_process_id,0) = 0, @process_id, @next_process_id)     
		   ,status_id      = @status_id     
		   ,remarks        = @remarks
	 WHERE request_id = @request_id;
    END;
	IF ISNULL(@next_process_id,0) <> 0
		INSERT INTO dbo.request_routing
		(process_id
		,request_id
		,status_id
		,remarks
		,created_by
		,created_date
		)
		values
		(@process_id
		,@id
		,@status_id
		,@remarks
		,@user_id
		,GETDATE()	   
		)
	RETURN @id;
END;

