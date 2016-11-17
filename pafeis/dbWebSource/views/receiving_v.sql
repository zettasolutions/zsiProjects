CREATE VIEW dbo.receiving_v
AS
SELECT        dbo.receiving.receiving_id, dbo.receiving.receiving_no, dbo.receiving.invoice_no, dbo.receiving.invoice_date, dbo.receiving.dr_no, dbo.receiving.dr_date, dbo.receiving.dealer_id, 
                         dbo.receiving.receiving_organization_id, dbo.receiving.authority_id, dbo.receiving.transfer_organization_id, dbo.receiving.stock_transfer_no, dbo.receiving.received_by, dbo.receiving.received_date, 
                         dbo.getStatusByPageProcessActionId(dbo.receiving.status_id) AS status, dbo.receiving.status_remarks, dbo.receiving.created_by, dbo.receiving.created_date, dbo.receiving.updated_by, 
                         dbo.receiving.updated_date, dbo.receiving_routings_current_v.role_id
FROM            dbo.receiving LEFT OUTER JOIN
                         dbo.receiving_routings_current_v ON dbo.receiving.receiving_id = dbo.receiving_routings_current_v.doc_id
