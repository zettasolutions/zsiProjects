

create FUNCTION [dbo].[getAircraftName] 
(
	@aircraft_id			as int
)
RETURNS varchar(50)
AS
BEGIN   
   DECLARE @l_retval   varchar(50);
   SELECT @l_retval = aircraft_name FROM dbo.aircraft_info where aircraft_info_id = @aircraft_id
   RETURN @l_retval;
END;

