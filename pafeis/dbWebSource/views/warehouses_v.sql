
CREATE VIEW [dbo].[warehouses_v]
AS
SELECT        dbo.warehouses.warehouse_id, dbo.warehouses.squadron_id, dbo.warehouses.warehouse_code, dbo.warehouses.warehouse_location, dbo.warehouses.is_active, dbo.warehouses.created_by, 
                         dbo.warehouses.created_date, dbo.warehouses.updated_by, dbo.warehouses.updated_date,
                         dbo.organizations.organization_name + N'-' + dbo.warehouses.warehouse_location AS organization_warehouse
FROM            dbo.warehouses INNER JOIN
                         dbo.organizations ON dbo.warehouses.squadron_id = dbo.organizations.organization_id

