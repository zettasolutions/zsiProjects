

CREATE VIEW [dbo].[vehicles_v]
AS
SELECT dbo.vehicles.*, dbo.vehicle_maker.maker_name, CONCAT(fm.vehicle_type,' (', fm.transport_group,')') vehicle_type, rf.route_code
FROM  dbo.vehicles INNER JOIN
      dbo.vehicle_maker ON dbo.vehicles.vehicle_maker_id = dbo.vehicle_maker.vehicle_maker_id INNER JOIN
	  zsi_afcs.dbo.fare_matrix_v fm ON dbo.vehicles.vehicle_type_id = fm.fare_id INNER JOIN
	  zsi_afcs.dbo.routes_ref rf ON dbo.vehicles.route_id = rf.route_id;
				  
