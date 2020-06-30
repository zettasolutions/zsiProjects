
CREATE VIEW [dbo].[loading_v]
AS
SELECT        dbo.loading.*, dbo.users.company_id, CONCAT(dbo.users.first_name,' ', dbo.users.last_name) as loaded_by
FROM            dbo.loading LEFT JOIN
                         dbo.users ON dbo.loading.load_by = dbo.users.user_id


