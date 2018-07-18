
CREATE VIEW [dbo].[requests_v]
AS
SELECT        dbo.requests.request_id, dbo.requests.request_no, dbo.requests.client_id, dbo.requests.app_id, dbo.requests.request_desc, dbo.requests.category_id, dbo.requests.type_id, dbo.requests.priority_level, 
                         dbo.requests.process_id, dbo.requests.status_id, dbo.requests.remarks, dbo.requests.created_by, dbo.requests.created_date, dbo.requests.updated_by, dbo.requests.updated_date, dbo.statuses.icon, 
                         dbo.processes.process_title, dbo.statuses.seq_no, dbo.statuses.status_name
FROM            dbo.requests INNER JOIN
                         dbo.statuses ON dbo.requests.status_id = dbo.statuses.status_id INNER JOIN
                         dbo.processes ON dbo.requests.process_id = dbo.processes.process_id

