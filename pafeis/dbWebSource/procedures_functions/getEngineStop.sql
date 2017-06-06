create FUNCTION dbo.getEngineStop 
(
   @flight_operation_id int
)
RETURNS VARCHAR(8000)
AS
BEGIN
   DECLARE @return_var VARCHAR(8000);

   SELECT @return_var = STUFF((SELECT '<BR> ' + CONCAT(CONVERT(VARCHAR(10),f.engine_shutdown,101),' ',CONVERT(VARCHAR(5),f.engine_shutdown,114))
             FROM dbo.flight_time f
             WHERE f.flight_operation_id = @flight_operation_id
             ORDER BY f.engine_shutdown
             FOR XML PATH('')), 1, 1, '') 

   RETURN @return_var;

END
