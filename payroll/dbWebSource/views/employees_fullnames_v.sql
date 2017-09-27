CREATE VIEW dbo.employees_fullnames_v
AS
SELECT        TOP (100) PERCENT last_name + ', ' + first_name AS full_name
FROM            dbo.users
ORDER BY full_name
