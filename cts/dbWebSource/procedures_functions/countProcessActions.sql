
CREATE FUNCTION [dbo].[countProcessActions] 
(
	@process_id			as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.process_statuses WHERE process_id = @process_id

   RETURN @l_retval;
END;



