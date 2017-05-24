CREATE FUNCTION [dbo].[getAircraftRoleName] 
(
	@aircraft_role_id			as int
)
RETURNS varchar(300)
AS
BEGIN   
   DECLARE @l_retval   varchar(300);
   SELECT @l_retval = aircraft_role FROM dbo.aircraft_role where aircraft_role_id = @aircraft_role_id
   RETURN @l_retval;
END;


