







CREATE VIEW [dbo].[payments_v]
AS
SELECT        dbo.payments.*, CONCAT(dbo.drivers_v.first_name,' ', dbo.drivers_v.last_name) AS driver, CONCAT(dbo.pao_v.first_name, ' ', dbo.pao_v.last_name) AS pao, dbo.drivers_v.company_code, iif(isnull(qr_id,0)=0,'CASH','QR') payment_type, rr.route_code
FROM            dbo.payments INNER JOIN
                         dbo.drivers_v ON dbo.payments.driver_id = dbo.drivers_v.user_id INNER JOIN
                         dbo.pao_v ON dbo.payments.pao_id = dbo.pao_v.user_id INNER JOIN
						 dbo.routes_ref rr ON dbo.payments.route_id = rr.route_id


						 


