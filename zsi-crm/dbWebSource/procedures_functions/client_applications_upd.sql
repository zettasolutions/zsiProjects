CREATE PROCEDURE [dbo].[client_applications_upd]
(
    @tt    client_applications_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	     client_id				= b.client_id	
			,app_id					= b.app_id
			,is_active				= b.is_active
	   	    ,updated_by				= @user_id
			,updated_date			= GETDATE()

       FROM dbo.client_applications a INNER JOIN @tt b
	     ON a.client_app_id = b.client_app_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO client_applications(
         client_id
		,app_id
		,is_active
		,created_by
		,created_date
    )
	SELECT 
		 client_id
		,app_id
		,is_active
	    ,@user_id
	    ,GETDATE()
	FROM @tt 
	WHERE client_app_id IS NULL
	AND client_id IS NOT NULL
	AND app_id IS NOT NULL



