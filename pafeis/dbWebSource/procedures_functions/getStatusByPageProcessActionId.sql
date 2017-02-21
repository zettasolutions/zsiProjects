
CREATE FUNCTION [dbo].[getStatusByPageProcessActionId](
  @page_process_action_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_status VARCHAR(100); 
      SELECT @l_status = dbo.getStatus(status_id) FROM dbo.page_process_actions where page_process_action_id = @page_process_action_id
      RETURN @l_status;
END;



