CREATE FUNCTION [dbo].[getPageProcessActionIdByStatusId](
  @status_id int
 ,@page_id   int
) 
RETURNS INT 
AS
BEGIN
   DECLARE @l_retval int; 
      SELECT @l_retval = page_process_action_id FROM dbo.page_process_actions_v where status_id = @status_id and page_id=@page_id
      RETURN @l_retval;
END;



