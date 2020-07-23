


CREATE VIEW  [dbo].[active_vehicles_v] as
SELECT * FROM zsi_fmis.dbo.vehicles where is_active='Y'

