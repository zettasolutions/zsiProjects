CREATE FUNCTION [dbo].[getPageCurrentRoleId](
@page_id int
) 
RETURNS INT
AS
BEGIN
	DECLARE @role_id INT; 

	SELECT @role_id = role_id FROM dbo.doc_routings 
	WHERE page_id = @page_id
	AND is_current = 'Y';

	RETURN @role_id;
END;

