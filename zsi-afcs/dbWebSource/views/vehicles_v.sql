CREATE VIEW dbo.vehicles_v
AS
SELECT dbo.routes_ref.route_code, dbo.routes_ref.route_desc, dbo.vehicles.vehicle_id, dbo.vehicles.vehicle_plate_no, dbo.vehicles.route_id, dbo.vehicles.company_id, dbo.vehicles.hash_key, dbo.vehicles.vehicle_type_id, dbo.vehicles.is_active, 
                  dbo.vehicles.transfer_type_id, dbo.vehicles.bank_id, dbo.vehicles.transfer_no, dbo.vehicles.account_name, dbo.vehicles.vehicle_img_filename, dbo.vehicles.created_by, dbo.vehicles.created_date, dbo.vehicles.updated_by, 
                  dbo.vehicles.updated_date, dbo.fare_matrix.base_kms, dbo.fare_matrix.succeeding_km_fare, dbo.fare_matrix.vehicle_type
FROM     dbo.routes_ref INNER JOIN
                  dbo.vehicles ON dbo.routes_ref.route_id = dbo.vehicles.route_id INNER JOIN
                  dbo.fare_matrix ON dbo.vehicles.vehicle_type_id = dbo.fare_matrix.fare_id
