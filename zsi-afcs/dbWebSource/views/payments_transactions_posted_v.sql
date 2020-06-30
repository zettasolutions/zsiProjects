CREATE VIEW dbo.payments_transactions_posted_v
AS
SELECT        dbo.payments.payment_date, dbo.payments.payment_id, dbo.payments.from_location, dbo.payments.to_location, dbo.payments.no_klm, dbo.payments.no_reg, dbo.payments.no_stu, dbo.payments.no_sc, 
                         dbo.payments.no_pwd, dbo.payments.reg_amount, dbo.payments.stu_amount, dbo.payments.sc_amount, dbo.payments.pwd_amount, dbo.payments.total_paid_amount, dbo.payments.post_id, dbo.vehicles.vehicle_plate_no, 
                         dbo.routes_ref.route_code
FROM            dbo.payments INNER JOIN
                         dbo.routes_ref ON dbo.payments.route_id = dbo.routes_ref.route_id INNER JOIN
                         dbo.vehicles ON dbo.payments.vehicle_id = dbo.vehicles.vehicle_id
WHERE        (dbo.payments.post_id IS NOT NULL)
