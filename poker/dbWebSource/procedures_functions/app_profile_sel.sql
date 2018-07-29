CREATE procedure [dbo].[app_profile_sel]
(
   @user_id INT = NULL
)
as
 
select top 1 
	 ap.app_title
	,ap.date_format
	,ap.excel_conn_str
	,ap.excel_folder
	,ap.image_folder
	,ap.default_page
	,ap.network_group_folder
	,ap.theme_id
	,ap.developer_key
	,ap.is_source_minified
	,'selectoption,masterpages,table,filemanager,tablelayout,errors,appprofile' system_pages 
from dbo.app_profile ap


