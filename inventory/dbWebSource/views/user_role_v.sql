CREATE VIEW dbo.user_role_v
AS
SELECT        
	TOP (100) PERCENT 
	 u.*
	,r.role_name
	,r.is_export_excel
	,r.is_export_pdf
	,r.is_import_excel
FROM            
dbo.users_v u LEFT OUTER JOIN
dbo.roles r ON u.role_id = r.role_id


 
