
CREATE PROCEDURE [dbo].[dd_drivers_sel]
(
   @user_id  int = null
)
AS
BEGIN
      SELECT user_id, full_name FROM dbo.drivers_v; 
END


