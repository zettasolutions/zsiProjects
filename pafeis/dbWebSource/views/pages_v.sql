
CREATE VIEW [dbo].[pages_v]
AS
SELECT        dbo.pages.page_id, dbo.pages.page_name, dbo.pages.page_title, dbo.master_pages.master_page_id, dbo.master_pages.master_page_name,dbo.countPageProcesses(dbo.pages.page_id) AS ProcessCount
FROM            dbo.pages INNER JOIN
                         dbo.master_pages ON dbo.pages.master_page_id = dbo.master_pages.master_page_id


