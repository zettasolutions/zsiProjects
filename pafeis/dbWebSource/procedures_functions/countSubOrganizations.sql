

CREATE FUNCTION [dbo].[countSubOrganizations] 
(
	@organization_id	as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.organizations WHERE organization_pid = @organization_id

   RETURN @l_retval;
END;





