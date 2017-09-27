
CREATE VIEW [dbo].[receiving2_v]
AS
SELECT        dbo.receiving.receiving_id, dbo.receiving.receiving_no, dbo.receiving.doc_no, dbo.receiving.doc_date, dbo.receiving.dealer_id, dbo.receiving.aircraft_id, dbo.receiving.received_by, dbo.receiving.received_date, 
                         dbo.getStatusByPageProcessActionId(dbo.receiving.status_id) AS status, dbo.receiving.status_remarks, dbo.receiving.created_by, dbo.receiving.created_date, dbo.receiving.updated_by, 
                         dbo.receiving.updated_date, dbo.receiving_routings_current_v.role_id, dbo.getDealerName(dbo.receiving.dealer_id) AS dealer_name, dbo.getOrganizationWarehouse(dbo.receiving.warehouse_id) 
                         AS receiving_warehouse, dbo.getOrganizationWarehouse(dbo.receiving.issuance_warehouse_id) AS issuance_warehouse, dbo.getAircraftName(dbo.receiving.aircraft_id) AS aircraft_name, 
                         dbo.getUserFullName(dbo.receiving.received_by) AS received_by_name, dbo.getStatus(dbo.receiving.status_id) AS status_name, dbo.receiving_routings_current_v.process_desc, dbo.receiving.receiving_type, 
                         dbo.receiving.issuance_warehouse_id, dbo.warehouses.squadron_id, dbo.receiving.status_id, dbo.receiving.warehouse_id, dbo.receiving.procurement_id, dbo.receiving.donor, 
                         dbo.receiving.supply_source_id
FROM            dbo.receiving INNER JOIN
                         dbo.warehouses ON dbo.receiving.warehouse_id = dbo.warehouses.warehouse_id LEFT OUTER JOIN
                         dbo.receiving_routings_current_v ON dbo.receiving.receiving_id = dbo.receiving_routings_current_v.doc_id

