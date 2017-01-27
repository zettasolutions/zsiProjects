CREATE VIEW dbo.warehouses_v
AS
SELECT        dbo.warehouses.*, dbo.countWarehouseBins(warehouse_id) AS countWarehouseBins
FROM            dbo.warehouses
