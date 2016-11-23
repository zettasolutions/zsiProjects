CREATE VIEW dbo.organizations_v
AS
SELECT        dbo.organizations.organization_id, dbo.organizations.organization_type_id, dbo.organizations.organization_code, dbo.organizations.organization_name, dbo.organizations.organization_pid, 
                         dbo.organizations.is_active, dbo.organization_types.level_no, dbo.organizations.created_by, dbo.organizations.created_date, dbo.organizations.updated_by, dbo.organizations.updated_date, 
                         dbo.organizations.organization_head_id, dbo.organizations.organization_address
FROM            dbo.organizations INNER JOIN
                         dbo.organization_types ON dbo.organizations.organization_type_id = dbo.organization_types.organization_type_id
