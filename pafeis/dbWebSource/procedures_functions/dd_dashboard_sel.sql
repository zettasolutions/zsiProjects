CREATE PROCEDURE [dbo].[dd_dashboard_sel]
(
    @user_id	    INT = null
)
AS
BEGIN

SET NOCOUNT ON

  select page_id, page_title, page_name from dbo.[user_dashboards](@user_id) where isnull(page_id,0) <> 0 order by 2
  
END

