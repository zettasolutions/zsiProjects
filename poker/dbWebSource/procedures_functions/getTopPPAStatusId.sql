

CREATE FUNCTION [dbo].[getTopPPAStatusId](
  @page_process_action_id int
) 
RETURNS int
AS
BEGIN
   DECLARE @l_status_id int; 
      SELECT @l_status_id = status_id FROM dbo.page_process_actions where page_process_action_id = @page_process_action_id
      RETURN @l_status_id;
END;




