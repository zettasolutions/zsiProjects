
CREATE PROCEDURE [dbo].[flight_time_sel]
(
     @flight_operation_id  INT = null
	,@is_active  CHAR(1) = 'Y'
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)

  SET @stmt = 'SELECT * FROM dbo.flight_time_v '

 -- IF ISNULL(@flight_operation_id,0) <>0
  BEGIN
      SET @stmt = @stmt + ' WHERE flight_operation_id = ' + CAST(@flight_operation_id AS VARCHAR(20)); 
  END

  EXEC(@stmt);
	
END