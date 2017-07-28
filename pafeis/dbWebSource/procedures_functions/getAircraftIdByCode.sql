

CREATE FUNCTION [dbo].[getAircraftIdByCode] 
(
	@aircraft_code			as nvarchar(50)
)
RETURNS int
AS
BEGIN   
   DECLARE @l_retval   int;
   SELECT @l_retval = aircraft_info_id FROM dbo.aircraft_info where aircraft_code = @aircraft_code
   RETURN @l_retval;
END;

