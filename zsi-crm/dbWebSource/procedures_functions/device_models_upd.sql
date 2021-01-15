CREATE PROCEDURE [dbo].[device_models_upd]
(
    @tt    device_models_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	     brand_id			= b.brand_id
			,model_no				= b.model_no
			,model_name				= b.model_name
			,model_desc				= b.model_desc
			,is_active				= b.is_active
	   	    ,updated_by				= @user_id
			,updated_date			= DATEADD(HOUR, 8, GETUTCDATE())

       FROM dbo.device_models a INNER JOIN @tt b
	     ON a.device_model_id = b.device_model_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO device_models(
         brand_id
		,model_no
		,model_name
		,model_desc
		,is_active
		,created_by
		,created_date
    )
	SELECT 
		 brand_id
		,model_no
		,model_name
		,model_desc
		,is_active
	    ,@user_id
	    ,DATEADD(HOUR, 8, GETUTCDATE())
	FROM @tt 
	WHERE device_model_id IS NULL
	AND brand_id IS NOT NULL
	AND model_no IS NOT NULL
	AND model_name IS NOT NULL








