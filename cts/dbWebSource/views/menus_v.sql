




CREATE VIEW [dbo].[menus_v]
AS
SELECT        dbo.menus.menu_id, dbo.menus.pmenu_id, dbo.menus.icon, dbo.menus.menu_name, dbo.menus.seq_no
             , dbo.menus.page_id, dbo.menus.is_default, dbo.pages.page_title, dbo.pages.page_name
FROM          dbo.menus LEFT OUTER JOIN
              dbo.pages ON dbo.menus.page_id = dbo.pages.page_id







