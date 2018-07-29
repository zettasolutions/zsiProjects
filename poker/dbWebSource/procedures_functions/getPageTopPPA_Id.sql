
CREATE FUNCTION [dbo].[getPageTopPPA_Id](
 @page_id int
) 
RETURNS INT
AS
BEGIN
	DECLARE @ppa_id INT; 

	SELECT TOP 1 @ppa_id = page_process_action_id FROM dbo.page_process_actions_v
	WHERE page_id = @page_id and is_default ='Y'

	RETURN @ppa_id;
END;

