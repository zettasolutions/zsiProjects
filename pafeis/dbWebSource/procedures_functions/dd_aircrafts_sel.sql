
CREATE PROCEDURE [dbo].[dd_aircrafts_sel]
(
   @user_id           INT = NULL
  ,@squadron_id       INT = NULL
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)

SET @stmt = 'SELECT aircraft_info_id, aircraft_name FROM dbo.aircraft_info WHERE 1=1'

IF ISNULL(@squadron_id,0) <> 0 
   SET @stmt = @stmt + ' AND squadron_id = ' +  CAST(@squadron_id AS VARCHAR(20))
 
EXEC(@stmt);
	
END

