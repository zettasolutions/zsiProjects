


CREATE FUNCTION [dbo].[getOrganizationIdByName] 
(
	@organization			as nvarchar(max)
)
RETURNS int
AS
BEGIN   
   DECLARE @l_retval   int;
   SELECT @l_retval = organization_id FROM dbo.organizations where organization_name = @organization
   RETURN @l_retval;
END;


