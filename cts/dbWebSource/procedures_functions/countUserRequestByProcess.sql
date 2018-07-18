
CREATE FUNCTION [dbo].[countUserRequestByProcess](
   @user_id    int
  ,@client_id  int
  ,@process_id int)
RETURNS INT
AS
BEGIN
DECLARE @retval INT
   SELECT @retval = COUNT(*) FROM dbo.requests WHERE client_id=@client_id and process_id = @process_id and process_id IN (SELECT process_id FROM dbo.user_role_processes_v where app_user_id = @user_id);
   RETURN @retval;
END




