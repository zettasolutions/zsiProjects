

CREATE VIEW [dbo].[user_roles_v]
AS
SELECT        dbo.user_roles.user_role_id, dbo.user_roles.user_id app_user_id, dbo.user_roles.role_id, dbo.roles.role_name
FROM            dbo.user_roles INNER JOIN
                         dbo.roles ON dbo.user_roles.role_id = dbo.roles.role_id


