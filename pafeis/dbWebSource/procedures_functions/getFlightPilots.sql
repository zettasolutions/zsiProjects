CREATE FUNCTION [dbo].[getFlightPilots] 
(
   @flight_operation_id int
)
RETURNS VARCHAR(max)
AS
BEGIN
   DECLARE @return_var VARCHAR(max);
   DECLARE @Delimiter CHAR(6) 
   SET @Delimiter = '<br />'

   SELECT @return_var = COALESCE(@return_var + @Delimiter,'') + f.pilot_name_id
             FROM dbo.flight_operation_pilots_v f
             WHERE f.flight_operation_id = @flight_operation_id;
             
   RETURN @return_var;

END


