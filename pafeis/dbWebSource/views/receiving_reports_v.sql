CREATE VIEW dbo.receiving_reports_v
AS
SELECT        dbo.receiving.receiving_id, dbo.receiving.receiving_no, dbo.receiving.doc_no, dbo.receiving.doc_date, dbo.receiving.dealer_id, dbo.receiving.aircraft_id, dbo.receiving.received_by, dbo.receiving.received_date, 
                         dbo.receiving.status_remarks, dbo.receiving.created_by, dbo.receiving.created_date, dbo.receiving.updated_by, dbo.receiving.updated_date, dbo.getDealerName(dbo.receiving.dealer_id) AS dealer_name, 
                         dbo.getOrganizationWarehouse(dbo.receiving.warehouse_id) AS receiving_warehouse, dbo.getOrganizationWarehouse(dbo.receiving.issuance_warehouse_id) AS issuance_warehouse, 
                         dbo.getAircraftName(dbo.receiving.aircraft_id) AS aircraft_name, dbo.getUserFullName(dbo.receiving.received_by) AS received_by_name, dbo.receiving.receiving_type, dbo.receiving.issuance_warehouse_id, 
                         dbo.warehouses.squadron_id, dbo.receiving.status_id, dbo.receiving.warehouse_id, dbo.receiving.procurement_id, dbo.receiving.donor, dbo.receiving.supply_source_id, 
                         dbo.getSupplySourceName(dbo.receiving.supply_source_id) AS supply_source, dbo.receiving.authority_ref, dbo.procurement.po_code, dbo.procurement.po_date, dbo.procurement.procurement_type, 
                         dbo.procurement.procurement_mode
FROM            dbo.receiving LEFT OUTER JOIN
                         dbo.procurement ON dbo.receiving.procurement_id = dbo.procurement.procurement_id LEFT OUTER JOIN
                         dbo.warehouses ON dbo.receiving.warehouse_id = dbo.warehouses.warehouse_id
