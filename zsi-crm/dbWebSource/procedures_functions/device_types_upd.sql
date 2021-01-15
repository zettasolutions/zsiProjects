


CREATE PROCEDURE [dbo].[device_types_upd]
(
    @tt    device_types_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	     device_type_code		= b.device_type_code	
			,device_type			= b.device_type
			,device_type_desc		= b.device_type_desc
			,is_active				= b.is_active
	   	    ,updated_by				= @user_id
			,updated_date			= DATEADD(HOUR, 8, GETUTCDATE())

       FROM dbo.device_types a INNER JOIN @tt b
	     ON a.device_type_id = b.device_type_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO device_types(
         device_type_code
		,device_type
		,device_type_desc
		,is_active
		,created_by
		,created_date
    )
	SELECT 
		 device_type_code
		,device_type
		,device_type_desc
		,is_active
	    ,@user_id
	    ,DATEADD(HOUR, 8, GETUTCDATE())
	FROM @tt 
	WHERE device_type_id IS NULL
	AND device_type_code IS NOT NULL
	AND device_type IS NOT NULL
	AND device_type_desc IS NOT NULL






