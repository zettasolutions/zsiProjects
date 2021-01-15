
CREATE VIEW [dbo].[products_v]
AS
SELECT dbo.device_types.device_type_code, dbo.device_types.device_type, dbo.device_brands.device_brand_code, dbo.device_brands.device_brand_name, dbo.products.product_id, dbo.products.product_code, dbo.products.product_name, 
                  dbo.products.product_desc, dbo.products.product_srp, dbo.products.product_dp, dbo.products.device_brand_id, dbo.products.device_type_id, dbo.products.created_by, dbo.products.created_date, dbo.products.updated_by, 
                  dbo.products.updated_date
FROM     dbo.products LEFT OUTER JOIN
                  dbo.device_brands ON dbo.products.device_brand_id = dbo.device_brands.device_brand_id LEFT OUTER JOIN
                  dbo.device_types ON dbo.products.device_type_id = dbo.device_types.device_type_id
