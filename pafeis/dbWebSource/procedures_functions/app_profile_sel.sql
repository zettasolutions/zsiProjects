CREATE procedure [dbo].[app_profile_sel]
(
   @user_id INT = NULL
)
as
	select top 1 *
		,'selectoption,masterpages,table,filemanager,tablelayout,errors,appprofile' system_pages 
	from dbo.app_profile
