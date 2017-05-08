CREATE VIEW dbo.warehouses_v
AS
SELECT        dbo.warehouses.warehouse_id, dbo.warehouses.squadron_id, dbo.warehouses.warehouse_code, dbo.warehouses.warehouse_location, dbo.warehouses.is_active, dbo.warehouses.created_by, 
                         dbo.warehouses.created_date, dbo.warehouses.updated_by, dbo.warehouses.updated_date, dbo.organizations_v.organization_name + N'-' + dbo.warehouses.warehouse_location AS organization_warehouse, 
                         dbo.organizations_v.squadron_type, dbo.getWingId(dbo.warehouses.squadron_id) AS wing_id
FROM            dbo.warehouses INNER JOIN
                         dbo.organizations_v ON dbo.warehouses.squadron_id = dbo.organizations_v.organization_id
