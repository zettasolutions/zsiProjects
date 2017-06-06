CREATE FUNCTION dbo.delivery_timing_status (
  @delivery_timing INT
)
RETURNS NVARCHAR(20)
AS
BEGIN
  DECLARE @retval NVARCHAR(20)
  IF @delivery_timing IN (2,4) 
     SET @retval = 'ON-TIME'

  IF @delivery_timing IN (3,5) 
     SET @retval =  'LATE'

  RETURN @retval;
END

