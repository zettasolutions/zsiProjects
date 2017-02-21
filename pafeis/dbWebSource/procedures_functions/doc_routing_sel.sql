CREATE PROCEDURE [dbo].[doc_routing_sel]
(
    @page_id  INT = null
   ,@doc_id   INT
)
AS
BEGIN
   SELECT * FROM dbo.doc_routings WHERE page_id=@page_id and doc_id=@doc_id ORDER BY seq_no
END
 

