


CREATE PROCEDURE [dbo].[dd_applications_sel]
( 
    @user_id INT = NULL
)
AS
BEGIN
	SELECT app_id, app_code FROM dbo.applications;
 END;



