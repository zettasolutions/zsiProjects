CREATE FUNCTION [dbo].[countAircraftItems] 
(
	@aircraft_info_id			as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.items WHERE aircraft_info_id = @aircraft_info_id and isnull(parent_item_id,0)=0

   RETURN @l_retval;
END;




