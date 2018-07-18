
CREATE FUNCTION [dbo].[getCurrentDocRoutingStatus](
  @page_id int
 ,@doc_id  int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_status VARCHAR(100); 
      SELECT @l_status = status FROM dbo.doc_routings_v where page_id = @page_id and doc_id=@doc_id and is_current='Y'

      RETURN @l_status;
END;

