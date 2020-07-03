


CREATE VIEW [dbo].[payments_for_posting_v]
AS
SELECT        dbo.payments_v.payment_id, dbo.payments_v.payment_date, dbo.payments_v.device_id, dbo.payments_v.vehicle_id, dbo.payments_v.pao_id, dbo.payments_v.driver_id, dbo.payments_v.inspector_id, dbo.payments_v.route_id, 
                         dbo.payments_v.from_location, dbo.payments_v.to_location, dbo.payments_v.no_klm, dbo.payments_v.no_reg, dbo.payments_v.no_stu, dbo.payments_v.no_sc, dbo.payments_v.no_pwd, dbo.payments_v.reg_amount, dbo.payments_v.stu_amount, 
                         dbo.payments_v.sc_amount, dbo.payments_v.pwd_amount, dbo.payments_v.total_paid_amount, dbo.payments_v.post_id, dbo.payments_v.qr_id, dbo.drivers_v.full_name AS driver, dbo.pao_v.full_name AS pao, 
                         dbo.vehicles.vehicle_plate_no, dbo.drivers_v.company_code, dbo.payments_v.route_code, dbo.payments_v.payment_type
FROM            dbo.payments_v INNER JOIN
                         dbo.drivers_v ON dbo.payments_v.driver_id = dbo.drivers_v.user_id INNER JOIN
                         dbo.pao_v ON dbo.payments_v.pao_id = dbo.pao_v.user_id INNER JOIN
                         dbo.vehicles ON dbo.payments_v.vehicle_id = dbo.vehicles.vehicle_id
WHERE        (dbo.payments_v.post_id IS NULL)

