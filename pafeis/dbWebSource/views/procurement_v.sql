CREATE VIEW dbo.procurement_v
AS
SELECT        dbo.procurement.procurement_id, dbo.procurement.procurement_date, dbo.procurement.procurement_code, dbo.procurement.procurement_name, dbo.procurement.supplier_id, 
                         dbo.procurement.supplier_promised_delivery_date, dbo.procurement.status_id, dbo.procurement_routings_current_v.role_id, dbo.procurement.created_by, dbo.procurement.created_date, 
                         dbo.procurement.updated_by, dbo.procurement.updated_date
FROM            dbo.procurement INNER JOIN
                         dbo.procurement_routings_current_v ON dbo.procurement.procurement_id = dbo.procurement_routings_current_v.doc_id
