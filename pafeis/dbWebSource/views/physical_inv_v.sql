
CREATE VIEW [dbo].[physical_inv_v]
AS
SELECT        dbo.physical_inv.physical_inv_id, dbo.physical_inv.physical_inv_no, dbo.physical_inv.physical_inv_date, dbo.physical_inv.organization_id, dbo.physical_inv.warehouse_id, dbo.physical_inv.done_by, 
                         dbo.physical_inv.created_by, dbo.physical_inv.created_date, dbo.physical_inv.updated_by, dbo.physical_inv.updated_date, dbo.physical_inv.status_id, dbo.physical_inv.status_remarks, 
                         dbo.getStatusByPageProcessActionId(dbo.physical_inv.status_id) AS status, dbo.physical_inv_routings_current_v.role_id, dbo.getStatus(dbo.physical_inv.status_id) AS status_name, 
                         dbo.physical_inv_routings_current_v.process_desc, dbo.getWarehouseLocation(dbo.physical_inv.warehouse_id) AS warehouse, dbo.getUserFullName(dbo.physical_inv.done_by) AS emp_done_by, 
                         CONCAT(dbo.getWarehouseCode(dbo.physical_inv.warehouse_id),'-',CAST(YEAR(dbo.physical_inv.physical_inv_date) AS varchar(20)),'-', cast(dbo.physical_inv.physical_inv_no as varchar(20))) AS pi_no
FROM            dbo.physical_inv LEFT OUTER JOIN
                         dbo.physical_inv_routings_current_v ON dbo.physical_inv.physical_inv_id = dbo.physical_inv_routings_current_v.doc_id

