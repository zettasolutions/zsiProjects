

CREATE FUNCTION [dbo].[getWingId] 
(
	@organization_id			as int
)
RETURNS int
AS
BEGIN   
   DECLARE @l_retval   int;
   SELECT @l_retval = organization_pid FROM dbo.organizations_v WHERE organization_id=@organization_id 
   RETURN @l_retval;
END;


