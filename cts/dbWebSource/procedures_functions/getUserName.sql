CREATE FUNCTION [dbo].[getLogonName] 
(
	@user_id			as int
)
RETURNS varchar(50)
AS
BEGIN   
	DECLARE @l_retval   varchar(200);
	
	SELECT	@l_retval =   user_name  FROM	dbo.users 
	where user_id = @user_id  AND user_name IS NOT NULL


 RETURN @l_retval;

END;

