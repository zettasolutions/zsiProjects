

CREATE FUNCTION [dbo].[countSubOrganizations] 
(
	@organization_id	as int
   ,@level_no           as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.organizations_v WHERE organization_pid = @organization_id and level_no=@level_no

   RETURN @l_retval;
END;





