CREATE VIEW dbo.issuance_details_v
AS
SELECT        dbo.issuance_details.issuance_detail_id, dbo.issuance_details.issuance_id, dbo.issuance_details.item_id, dbo.issuance_details.aircraft_id, dbo.issuance_details.unit_of_measure_id, 
                         dbo.issuance_details.quantity, dbo.issuance_details.remarks, dbo.issuances.transfer_organization_id, dbo.issuances.organization_id, dbo.issuance_routings_current_v.role_id, 
                         dbo.issuance_details.item_code_id
FROM            dbo.issuances INNER JOIN
                         dbo.issuance_details ON dbo.issuances.issuance_id = dbo.issuance_details.issuance_id LEFT OUTER JOIN
                         dbo.issuance_routings_current_v ON dbo.issuance_details.issuance_id = dbo.issuance_routings_current_v.doc_id
