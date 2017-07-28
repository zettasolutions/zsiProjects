

CREATE FUNCTION [dbo].[getItemIdBySerial] 
(
	@serial_no			as nvarchar(50)
)
RETURNS int
AS
BEGIN   
   DECLARE @l_retval   int;
   SELECT @l_retval = item_id FROM dbo.items where serial_no = @serial_no
   RETURN @l_retval;
END;

