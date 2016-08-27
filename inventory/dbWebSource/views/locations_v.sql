CREATE VIEW dbo.locations_v
AS
SELECT     loc_id, location, created_by, created_date, updated_by, updated_date, loc_group_id
FROM         dbo.locations
