CREATE VIEW dbo.adjustments_v
AS
SELECT        dbo.adjustments.adjustment_id, dbo.adjustments.adjustment_no, dbo.adjustments.adjustment_date, dbo.adjustments.warehouse_id, dbo.adjustments.adjustment_by, dbo.adjustments.adjustment_remarks, 
                         dbo.adjustments.status_id, dbo.adjustments.created_by, dbo.adjustments.created_date, dbo.adjustments.updated_by, dbo.adjustments.updated_date, dbo.warehouses.squadron_id, 
                         dbo.page_process_roles.role_id, dbo.warehouses.warehouse_location, dbo.getUserFullName(dbo.adjustments.adjustment_by) AS adjusted_by, dbo.getStatus(dbo.adjustments.status_id) AS status_name
FROM            dbo.adjustments INNER JOIN
                         dbo.adjustments_routings_current_v ON dbo.adjustments.adjustment_id = dbo.adjustments_routings_current_v.doc_id INNER JOIN
                         dbo.warehouses ON dbo.adjustments.warehouse_id = dbo.warehouses.warehouse_id INNER JOIN
                         dbo.page_process_roles ON dbo.adjustments_routings_current_v.page_process_id = dbo.page_process_roles.page_process_id
