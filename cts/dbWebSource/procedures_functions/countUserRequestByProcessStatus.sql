
CREATE FUNCTION [dbo].[countUserRequestByProcessStatus](
   @user_id    int
  ,@status_id  int)
RETURNS INT
AS
BEGIN
DECLARE @retval INT
   SELECT @retval = COUNT(*) FROM dbo.requests WHERE status_id = @status_id and process_id IN (SELECT process_id FROM dbo.user_role_processes_v where app_user_id = @user_id);
   RETURN @retval;
END


