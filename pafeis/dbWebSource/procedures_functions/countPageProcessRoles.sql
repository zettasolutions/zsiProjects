

create FUNCTION [dbo].[countPageProcessRoles] 
(
	@page_process_id			as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.page_process_roles WHERE page_process_id = @page_process_id

   RETURN @l_retval;
END;




