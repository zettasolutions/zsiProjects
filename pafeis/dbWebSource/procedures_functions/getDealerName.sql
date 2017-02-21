CREATE FUNCTION [dbo].[getDealerName](
@dealer_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_name VARCHAR(100); 
      SELECT @l_name = dealer_name FROM dbo.dealers where dealer_id = @dealer_id
      RETURN @l_name;
END;


