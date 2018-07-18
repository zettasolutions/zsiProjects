CREATE FUNCTION [dbo].[IsEndProcess](
 @page_process_action_id int
) 
RETURNS INT
AS
BEGIN
	DECLARE @retval char(1); 

	SELECT @retval = is_end_process FROM dbo.page_process_actions 
	WHERE page_process_action_id = @page_process_action_id 

	RETURN @retval;
END;

