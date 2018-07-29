CREATE FUNCTION [dbo].[getEngineStart] 
(
   @flight_operation_id int
)
RETURNS VARCHAR(max)
AS
BEGIN
   DECLARE @return_var VARCHAR(max);
   DECLARE @Delimiter CHAR(6) 
   SET @Delimiter = '<br />'

   SELECT @return_var = COALESCE(@return_var + @Delimiter,'') + CONCAT(CONVERT(VARCHAR(10),f.engine_start,101),' ',CONVERT(VARCHAR(5),f.engine_start,114))
             FROM dbo.flight_time f
             WHERE f.flight_operation_id = @flight_operation_id;

   RETURN @return_var;

END
