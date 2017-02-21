
create FUNCTION [dbo].[getLogonName](
  @user_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_return VARCHAR(100); 
      SELECT @l_return = logon FROM dbo.users where user_id= @user_id
      RETURN @l_return;
END;
