
CREATE VIEW  [dbo].[inactive_vehicles_v] as
SELECT * FROM vehicles where is_active='N'