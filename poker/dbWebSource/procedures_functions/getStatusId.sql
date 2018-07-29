
CREATE FUNCTION [dbo].[getStatusId](
  @status  NVARCHAR(100) 
) 
RETURNS int
AS
BEGIN
   DECLARE @l_status int; 
      SELECT @l_status = status_id FROM dbo.statuses where status_name = @status
      RETURN @l_status;
END;
