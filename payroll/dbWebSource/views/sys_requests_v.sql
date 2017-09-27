CREATE VIEW [dbo].[sys_requests_v]
AS
SELECT        sr.*, dbo.getUser(sr.requested_by) requested_by_name
				 ,  dbo.getStatus(sr.status_id) status_desc
				 ,  rt.request_desc request_type_desc 
FROM            dbo.sys_requests sr
				INNER JOIN 
					dbo.request_types_v rt 
					ON sr.request_type_id = rt.request_type_id
						 
						 
		 
 
		  
	