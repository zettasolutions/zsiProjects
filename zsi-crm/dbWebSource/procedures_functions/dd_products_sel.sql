


CREATE PROCEDURE [dbo].[dd_products_sel]
( 
    @user_id INT = NULL
)
AS
BEGIN
	SELECT product_id, product_code, product_name, product_desc, product_srp, product_dp, device_brand_id, device_type_id FROM dbo.products WHERE 1=1;
 END;


