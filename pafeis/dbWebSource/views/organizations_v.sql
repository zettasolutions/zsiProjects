

CREATE VIEW [dbo].[organizations_v]
AS
SELECT        dbo.organizations.organization_id, dbo.organizations.organization_type_id, dbo.organizations.organization_code, dbo.organizations.organization_name, dbo.organizations.organization_pid, 
                         dbo.organizations.is_active, dbo.organization_types.level_no, dbo.organizations.created_by, dbo.organizations.created_date, dbo.organizations.updated_by, dbo.organizations.updated_date, 
                         dbo.organizations.organization_head_id, dbo.organizations.organization_address, dbo.organizations.organization_group_id, dbo.organization_types.is_organization, dbo.organizations.squadron_type_id, 
                         dbo.squadron_types_v.squadron_type,dbo.squadron_types_v.page_id, dbo.squadron_types_v.page_title, dbo.squadron_types_v.page_name
FROM            dbo.organizations INNER JOIN
                         dbo.organization_types ON dbo.organizations.organization_type_id = dbo.organization_types.organization_type_id
						 LEFT OUTER JOIN
                         dbo.squadron_types_v ON dbo.organizations.squadron_type_id = dbo.squadron_types_v.squadron_type_id



