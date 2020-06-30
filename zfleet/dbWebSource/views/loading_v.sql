CREATE VIEW [dbo].[loading_v]
AS
SELECT        dbo.loading.*, dbo.users.company_code, CONCAT(dbo.users.first_name,' ', dbo.users.last_name) loaded_by
FROM            dbo.loading INNER JOIN
                         dbo.users ON dbo.loading.load_by = dbo.users.user_id


