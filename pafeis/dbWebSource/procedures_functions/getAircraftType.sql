


CREATE FUNCTION [dbo].[getAircraftType] 
(
	@aircraft_type_id AS INT
)
RETURNS varchar(50)
AS
BEGIN   
   DECLARE @l_retval   varchar(50);
   SELECT @l_retval = aircraft_type FROM dbo.aircraft_type where aircraft_type_id = @aircraft_type_id
   RETURN @l_retval;
END;


