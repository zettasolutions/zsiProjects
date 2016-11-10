
CREATE PROCEDURE [dbo].[page_processes_sel]
(
    @page_id  INT = null
)
AS
BEGIN
   SELECT * FROM dbo.page_processes_v WHERE page_id=@page_id ORDER BY seq_no
END
 

