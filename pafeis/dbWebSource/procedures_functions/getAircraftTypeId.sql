


CREATE FUNCTION [dbo].[getAircraftTypeId] 
(
	@aircraft_type AS NVARCHAR(100)
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval   INT;
   SELECT @l_retval = aircraft_type_id FROM dbo.aircraft_type where aircraft_type = @aircraft_type
   RETURN @l_retval;
END;

