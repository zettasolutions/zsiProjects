CREATE VIEW dbo.position_v
AS
SELECT        position_id, position_name, job_description, is_active, created_by, created_date, updated_by, updated_date
FROM            dbo.position
