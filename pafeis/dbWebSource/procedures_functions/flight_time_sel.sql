CREATE PROCEDURE [dbo].[flight_time_sel]
(
     @flight_time_id  INT = null
	,@is_active  CHAR(1) = 'Y'
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)

  SET @stmt = 'SELECT * FROM dbo.flight_time WHERE is_active = ''' + @is_active + ''''

  IF @flight_time_id IS NOT NULL  
	 SELECT * FROM dbo.flight_time WHERE flight_time_id = @flight_time_id; 
  ELSE
     SELECT * FROM dbo.flight_time
	
END