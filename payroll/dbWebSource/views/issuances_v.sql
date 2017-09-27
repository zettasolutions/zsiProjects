CREATE VIEW dbo.issuances_v
AS
SELECT        dbo.issuances.issuance_id, dbo.issuances.issuance_no, dbo.issuances.organization_id, dbo.issuances.issued_by, dbo.issuances.issued_date, dbo.issuances.issuance_directive_code, 
                         dbo.issuances.created_by, dbo.issuances.created_date, dbo.issuances.updated_by, dbo.issuances.updated_date, dbo.issuances.aircraft_id, dbo.issuances.status_id, dbo.issuances.status_remarks, 
                         dbo.issuances.authority_ref, dbo.issuances.transfer_warehouse_id, dbo.countIssuanceDetails(dbo.issuances.issuance_id) AS countIssuanceDetails, 
                         dbo.getOrganizationWarehouse(dbo.issuances.transfer_warehouse_id) AS transfer_organization_warehouse, dbo.getAircraftName(dbo.issuances.aircraft_id) AS aircraft_name, 
                         dbo.getUserFullName(dbo.issuances.issued_by) AS issued_by_name, dbo.getStatus(dbo.issuances.status_id) AS status_name, dbo.issuances.warehouse_id, dbo.issuances.issuance_type, 
                         dbo.issuances.dealer_id, dbo.issuances.img_filename, dbo.issuances.accepted_by, dbo.issuances.issued_to_organization_id, dbo.getUserFullName(dbo.issuances.accepted_by) AS accepted_by_name, 
                         dbo.page_process_roles.role_id
FROM            dbo.issuances INNER JOIN
                         dbo.issuance_routings_current_v ON dbo.issuances.issuance_id = dbo.issuance_routings_current_v.doc_id INNER JOIN
                         dbo.page_process_roles ON dbo.issuance_routings_current_v.page_process_id = dbo.page_process_roles.page_process_id
