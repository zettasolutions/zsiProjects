
CREATE PROCEDURE [dbo].[doc_routings_upd]
(
   @page_id int
  ,@doc_id  int
)
AS
BEGIN
   INSERT INTO doc_routings (page_id, doc_id, seq_no, page_process_id, role_id, is_current)
   SELECT page_id, @doc_id,seq_no, page_process_id, role_id, is_default FROM dbo.page_processes
    WHERE is_active='Y' AND page_id=@page_id ORDER BY seq_no;    
END