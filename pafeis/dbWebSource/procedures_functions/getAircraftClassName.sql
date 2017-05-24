CREATE FUNCTION [dbo].[getAircraftClassName] 
(
	@aircraft_class_id			as int
)
RETURNS varchar(300)
AS
BEGIN   
   DECLARE @l_retval   varchar(300);
   SELECT @l_retval = aircraft_class FROM dbo.aircraft_class where aircraft_class_id = @aircraft_class_id
   RETURN @l_retval;
END;


