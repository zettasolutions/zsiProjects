CREATE VIEW dbo.issuances_v
AS
SELECT        dbo.issuances.issuance_id, dbo.issuances.issuance_no, dbo.issuances.organization_id, dbo.issuances.issued_by, dbo.issuances.issued_date, dbo.issuances.issuance_directive_id, dbo.issuances.created_by,
                          dbo.issuances.created_date, dbo.issuances.updated_by, dbo.issuances.updated_date, dbo.issuances.aircraft_id, dbo.issuances.status_id, dbo.issuances.status_remarks, dbo.issuances.authority_ref, 
                         dbo.issuances.transfer_warehouse_id, dbo.countIssuanceDetails(dbo.issuances.issuance_id) AS countIssuanceDetails, dbo.issuance_routings_current_v.role_id, 
                         dbo.getOrganizationWarehouse(dbo.issuances.transfer_warehouse_id) AS transfer_organization_warehouse, dbo.getAircraftName(dbo.issuances.aircraft_id) AS aircraft_name, 
                         dbo.getUserFullName(dbo.issuances.issued_by) AS issued_by_name, dbo.getStatusByPageProcessActionId(dbo.issuances.status_id) AS status_name, dbo.issuances.warehouse_id, 
                         dbo.issuances.issuance_type
FROM            dbo.issuances INNER JOIN
                         dbo.issuance_routings_current_v ON dbo.issuances.issuance_id = dbo.issuance_routings_current_v.doc_id
