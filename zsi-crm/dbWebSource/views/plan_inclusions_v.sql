CREATE VIEW dbo.plan_inclusions_v
AS
SELECT        dbo.plan_inclusions.plan_id, dbo.plan_inclusions.product_id, dbo.products.product_code, dbo.products.product_name, dbo.products.product_desc, dbo.products.product_srp, dbo.products.product_dp, 
                         dbo.products.device_brand_id, dbo.products.device_type_id
FROM            dbo.plan_inclusions INNER JOIN
                         dbo.products ON dbo.plan_inclusions.product_id = dbo.products.product_id
