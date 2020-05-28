CREATE PROCEDURE [dbo].[device_brands_upd]
(
    @tt    device_brands_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
			 device_type_id			= b.device_type_id	
	   	    ,device_brand_code		= b.device_brand_code	
			,device_brand_name		= b.device_brand_name 
			,is_active				= b.is_active
	   	    ,updated_by				= @user_id
			,updated_date			= GETDATE()

       FROM dbo.device_brands a INNER JOIN @tt b
	     ON a.device_brand_id = b.device_brand_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO device_brands(
         device_type_id
		,device_brand_code
		,device_brand_name 
		,is_active
		,created_by
		,created_date
    )
	SELECT 
		 device_type_id
		,device_brand_code
		,device_brand_name 
		,is_active
	    ,@user_id
	    ,GETDATE()
	FROM @tt 
	WHERE device_brand_id IS NULL
	AND device_type_id IS NOT NULL
	AND device_brand_code IS NOT NULL
	AND device_brand_name IS NOT NULL 








