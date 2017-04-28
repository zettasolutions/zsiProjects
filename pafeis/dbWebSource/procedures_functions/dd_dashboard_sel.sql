CREATE PROCEDURE [dbo].[dd_dashboard_sel]
(
    @user_id	    INT = null
)
AS
BEGIN



SET NOCOUNT ON

  select page_id, page_title, page_name from dbo.role_dashboards_v where role_id = dbo.getUserRoleId(@user_id) order by seq_no
  
END


