

CREATE FUNCTION [dbo].[countUserRequestByStatus](
   @user_id    int
  ,@status_id  int)
RETURNS INT
AS
BEGIN
DECLARE @retval INT
   SELECT @retval = COUNT(*) FROM dbo.requests WHERE status_id = @status_id and created_by = @user_id;
   RETURN @retval;
END



