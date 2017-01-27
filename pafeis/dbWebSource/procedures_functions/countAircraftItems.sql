CREATE FUNCTION [dbo].[countAircraftItems] 
(
	@aircraft_info_id			as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.items WHERE aircraft_info_id = @aircraft_info_id

   RETURN @l_retval;
END;




