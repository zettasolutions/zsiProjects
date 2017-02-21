
CREATE FUNCTION [dbo].[countPageProcessActionProcs] 
(
	@page_process_action_id			as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.page_process_action_procs WHERE page_process_action_id = @page_process_action_id

   RETURN @l_retval;
END;





