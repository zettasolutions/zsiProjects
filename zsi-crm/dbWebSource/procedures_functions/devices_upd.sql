CREATE PROCEDURE [dbo].[devices_upd]
(
    @tt    devices_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	     batch_id			= b.batch_id	
			,serial_no			= b.serial_no
			,tag_no				= b.tag_no
			,client_id			= b.client_id
			,released_date		= b.released_date
			,device_type_id		= b.device_type_id
			,is_active			= b.is_active
			,status_id			= b.status_id
	   	    ,updated_by			= @user_id
			,updated_date		= GETDATE()

       FROM dbo.devices a INNER JOIN @tt b
	     ON a.device_id = b.device_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO devices(
         batch_id
		,serial_no
		,tag_no
		,client_id
		,released_date
		,device_type_id
		,is_active
		,status_id
		,created_by
		,created_date
    )
	SELECT 
		 batch_id
		,serial_no
		,tag_no
		,client_id
		,released_date
		,device_type_id
		,is_active
		,status_id
	    ,@user_id
	    ,GETDATE()
	FROM @tt 
	WHERE device_id IS NULL
	AND batch_id IS NOT NULL
	AND serial_no IS NOT NULL
	AND tag_no IS NOT NULL






