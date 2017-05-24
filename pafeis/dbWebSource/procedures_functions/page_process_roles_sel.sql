


CREATE PROCEDURE [dbo].[page_process_roles_sel]
(
    @page_process_id  INT = null
)
AS
BEGIN
   SELECT * FROM dbo.page_process_roles WHERE page_process_id = @page_process_id;
END
 



