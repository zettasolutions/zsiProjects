CREATE VIEW dbo.physical_inv_v
AS
SELECT        dbo.physical_inv.physical_inv_id, dbo.physical_inv.physical_inv_no, dbo.physical_inv.physical_inv_date, dbo.physical_inv.organization_id, dbo.physical_inv.warehouse_id, dbo.physical_inv.done_by, 
                         dbo.physical_inv.created_by, dbo.physical_inv.created_date, dbo.physical_inv.updated_by, dbo.physical_inv.updated_date, dbo.physical_inv.status_id, dbo.physical_inv.status_remarks, 
                         dbo.getStatusByPageProcessActionId(dbo.physical_inv.status_id) AS status, dbo.getStatus(dbo.physical_inv.status_id) AS status_name, dbo.physical_inv_routings_current_v.process_desc, 
                         dbo.getWarehouseLocation(dbo.physical_inv.warehouse_id) AS warehouse, dbo.getUserFullName(dbo.physical_inv.done_by) AS emp_done_by, dbo.page_process_roles.role_id
FROM            dbo.page_process_roles INNER JOIN
                         dbo.physical_inv_routings_current_v ON dbo.page_process_roles.page_process_id = dbo.physical_inv_routings_current_v.page_process_id RIGHT OUTER JOIN
                         dbo.physical_inv ON dbo.physical_inv_routings_current_v.doc_id = dbo.physical_inv.physical_inv_id
