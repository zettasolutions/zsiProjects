create view dbo.page_templates_v 
 as
 select a.*,b.page_name,b.page_title,dbo.getUser(a.created_by) as created_by_name,dbo.getUser(a.updated_by) as updated_by_name from dbo.page_templates a left join dbo.pages b on a.page_id=b.page_id 

