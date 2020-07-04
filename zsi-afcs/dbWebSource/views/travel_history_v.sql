CREATE VIEW dbo.travel_history_v
AS
SELECT dbo.consumers_v.consumer_id, dbo.consumers_v.first_name, dbo.consumers_v.middle_name, dbo.consumers_v.last_name, dbo.consumers_v.name_suffix, dbo.consumers_v.gender, dbo.consumers_v.birthdate, 
                  dbo.consumers_v.image_filename, dbo.consumers_v.mobile_no, dbo.consumers_v.landline_no, dbo.consumers_v.activation_code, dbo.consumers_v.address, dbo.payments.payment_date, dbo.vehicles.vehicle_plate_no, 
                  dbo.routes_ref.route_code, dbo.drivers_v.full_name
FROM     dbo.payments INNER JOIN
                  dbo.consumers_v ON dbo.payments.consumer_id = dbo.consumers_v.consumer_id INNER JOIN
                  dbo.vehicles ON dbo.payments.vehicle_id = dbo.vehicles.vehicle_id INNER JOIN
                  dbo.drivers_v ON dbo.payments.driver_id = dbo.drivers_v.user_id LEFT OUTER JOIN
                  dbo.routes_ref ON dbo.payments.route_id = dbo.routes_ref.route_id