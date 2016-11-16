
CREATE FUNCTION [dbo].[getSubOrganizationType] 
(
	@level_no			as int
)
RETURNS VARCHAR(20)
AS
BEGIN   
   DECLARE @l_retval    varchar(20);
   SELECT TOP 1 @l_retval = organization_type_code + '_'+ cast(level_no as varchar(20)) FROM dbo.organization_types where level_no > @level_no order by level_no

   RETURN @l_retval;
END;

