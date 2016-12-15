CREATE VIEW dbo.receiving_v
AS
SELECT        dbo.receiving.receiving_id, dbo.receiving.receiving_no, dbo.receiving.doc_no, dbo.receiving.doc_date, dbo.receiving.dealer_id, dbo.receiving.receiving_organization_id, dbo.receiving.transfer_organization_id, 
                         dbo.receiving.aircraft_id, dbo.receiving.received_by, dbo.receiving.received_date, dbo.getStatusByPageProcessActionId(dbo.receiving.status_id) AS status, dbo.receiving.status_remarks, 
                         dbo.receiving.created_by, dbo.receiving.created_date, dbo.receiving.updated_by, dbo.receiving.updated_date, dbo.receiving_routings_current_v.role_id, 
                         dbo.getOrganizationName(dbo.receiving.receiving_organization_id) AS receiving_organization_name, dbo.getDealerName(dbo.receiving.dealer_id) AS dealer_name, 
                         dbo.getOrganizationName(dbo.receiving.transfer_organization_id) AS transfer_organization_name, dbo.getAircraftName(dbo.receiving.aircraft_id) AS aircraft_name, 
                         dbo.getUserFullName(dbo.receiving.received_by) AS received_by_name, dbo.getStatusByPageProcessActionId(dbo.receiving.status_id) AS status_name, dbo.receiving_routings_current_v.process_desc
FROM            dbo.receiving LEFT OUTER JOIN
                         dbo.receiving_routings_current_v ON dbo.receiving.receiving_id = dbo.receiving_routings_current_v.doc_id
