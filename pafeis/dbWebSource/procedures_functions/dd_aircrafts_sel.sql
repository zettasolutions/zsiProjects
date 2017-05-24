
CREATE PROCEDURE [dbo].[dd_aircrafts_sel]
(
   @user_id           INT = NULL
  ,@squadron_id       INT = NULL
)
AS
BEGIN

SET NOCOUNT ON

SELECT aircraft_info_id, aircraft_name FROM dbo.aircraft_info WHERE squadron_id = @squadron_id

	
END


