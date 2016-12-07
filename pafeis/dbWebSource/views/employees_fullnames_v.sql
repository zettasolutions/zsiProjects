CREATE VIEW dbo.employees_fullnames_v
AS
SELECT        last_name + ', ' + first_name AS full_name
FROM            dbo.users
