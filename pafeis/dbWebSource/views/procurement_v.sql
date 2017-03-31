


CREATE VIEW [dbo].[procurement_v]
AS
SELECT        dbo.procurement.procurement_id, dbo.procurement.procurement_date, dbo.procurement.procurement_code, dbo.procurement.procurement_name, dbo.procurement.supplier_id, 
                         dbo.procurement.promised_delivery_date, dbo.procurement_routings_current_v.role_id, dbo.procurement.created_by, dbo.procurement.created_date, dbo.procurement.updated_by, 
                         dbo.procurement.updated_date, dbo.statuses.status_code, dbo.statuses.status_name, dbo.statuses.status_color, dbo.sumProcurementAmount(dbo.procurement.procurement_id) AS total_amount, 
                         dbo.getDealerName(dbo.procurement.supplier_id) AS supplier_name, dbo.countProcurementItems(dbo.procurement.procurement_id) as no_items, 
						 dbo.sumProcurementItems(dbo.procurement.procurement_id) as total_ordered_qty,dbo.sumProcurementBalanceQty(dbo.procurement.procurement_id) as total_balance_qty, 
						 dbo.procurement.actual_delivery_date, dbo.procurement.procurement_type, dbo.procurement.procurement_mode, dbo.procurement.warehouse_id,
						 IIF(ISNULL(dbo.procurement.actual_delivery_date,'')<>'',
						 IIF(dbo.procurement.actual_delivery_date>promised_delivery_date,3,2),
						 IIF(GETDATE()>dbo.procurement.promised_delivery_date,5,4)) AS delivery_timing
FROM            dbo.procurement INNER JOIN
                         dbo.page_process_actions_v ON dbo.getPageProcessActionIdByStatusId(dbo.procurement.status_id,1107) = dbo.page_process_actions_v.page_process_action_id INNER JOIN
                         dbo.statuses ON dbo.page_process_actions_v.status_id = dbo.statuses.status_id LEFT OUTER JOIN
                         dbo.procurement_routings_current_v ON dbo.procurement.procurement_id = dbo.procurement_routings_current_v.doc_id



