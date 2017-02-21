
CREATE FUNCTION [dbo].[getOrganizationByUser] 
(
	@user_id			as int
)
RETURNS varchar(50)
AS
BEGIN   
   DECLARE @l_retval   varchar(50);
   SELECT @l_retval = dbo.getOrganizationName(organization_id) FROM dbo.users where user_id = @user_id
   RETURN @l_retval;
END;

