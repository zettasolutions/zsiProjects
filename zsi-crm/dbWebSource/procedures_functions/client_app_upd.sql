CREATE procedure [dbo].[client_app_upd](
   @client_id  int=null
  ,@app_id    int=null
  ,@client_app_id int=null
  ,@user_id   int
  ,@is_active varchar(1)='Y'
)
as
BEGIN
   SET NOCOUNT ON
	 IF ISNULL(@client_app_id,0)=0
		INSERT INTO dbo.client_applications
		 (
		  client_id
		 ,app_id
		 ,is_active
		 ,created_by
		 ,created_date
		 ) VALUES
		 (
		  @client_id
		 ,@app_id
		 ,@is_active
		 ,@user_id
		 ,DATEADD(HOUR, 8, GETUTCDATE())
		 ) 
	ELSE
	   UPDATE dbo.client_applications SET
				client_id		  = @client_id
			   ,app_id			  = @app_id
			   ,is_active		  = @is_active
			   ,updated_by        = @user_id
			   ,updated_date      = DATEADD(HOUR, 8, GETUTCDATE());
  
END;
