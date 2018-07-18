
CREATE FUNCTION [dbo].[countUserRoles] 
(
	@user_id			as int
)
RETURNS INT
AS
BEGIN   
   DECLARE @l_retval    INT;
   SELECT @l_retval = COUNT(*) FROM dbo.user_roles WHERE user_id = @user_id
   RETURN @l_retval;
END;



