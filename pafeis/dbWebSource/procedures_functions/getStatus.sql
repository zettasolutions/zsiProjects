CREATE FUNCTION [dbo].[getStatus](
  @status_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_status VARCHAR(100); 
      SELECT @l_status = status_name FROM dbo.statuses where status_id = @status_id
      RETURN @l_status;
END;