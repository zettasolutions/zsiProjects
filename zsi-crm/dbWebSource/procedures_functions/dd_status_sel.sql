
CREATE PROCEDURE [dbo].[dd_status_sel]
( 
     @user_id INT = NULL
)
AS
BEGIN
	SELECT status_code, status_desc FROM dbo.statuses WHERE 1 = 1;
 END;
