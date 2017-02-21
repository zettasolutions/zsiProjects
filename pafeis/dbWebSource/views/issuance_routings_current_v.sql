CREATE VIEW [dbo].[issuance_routings_current_v]
AS
SELECT        doc_routing_id, page_id, doc_id, seq_no, role_id, page_process_id, page_process_action_id, acted_by, acted_date, is_current, process_desc, action_desc, status
FROM            dbo.doc_routings_v
WHERE        (is_current = N'Y') AND (page_id = 66)

