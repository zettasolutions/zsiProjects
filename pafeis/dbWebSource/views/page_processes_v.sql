
CREATE VIEW [dbo].[page_processes_v]
AS
SELECT        dbo.page_processes.*, dbo.countPageProcessActions(page_process_id) AS countPageProcessActions
FROM            dbo.page_processes

