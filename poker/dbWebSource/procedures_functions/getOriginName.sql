CREATE FUNCTION [dbo].[getOriginName] 
(
	@origin_id			as int
)
RETURNS varchar(300)
AS
BEGIN   
   DECLARE @l_retval   varchar(300);
   SELECT @l_retval = origin_name FROM dbo.origin where origin_id = @origin_id
   RETURN @l_retval;
END;

