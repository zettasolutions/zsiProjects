


CREATE PROCEDURE [dbo].[dd_device_models_sel]
( 
    @user_id INT = NULL
)
AS
BEGIN
	SELECT device_model_id, model_name FROM dbo.device_models WHERE is_active='Y' ; 

 END;


