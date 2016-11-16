
CREATE FUNCTION [dbo].[getOrganizationTypeId] 
(
	@level_no			as int
)
RETURNS int
AS
BEGIN   
   DECLARE @l_retval   int;
   SELECT TOP 1 @l_retval = organization_type_id FROM dbo.organization_types where level_no = @level_no
   RETURN @l_retval;
END;

