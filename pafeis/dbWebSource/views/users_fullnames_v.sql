CREATE VIEW dbo.users_fullnames_v
AS
SELECT        TOP (100) PERCENT user_id, last_name + ', ' + first_name AS full_name
FROM            dbo.users
