

CREATE FUNCTION [dbo].[countPageProcessActions] 
(
	@page_process_id			as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.page_process_actions WHERE page_process_id = @page_process_id

   RETURN @l_retval;
END;




