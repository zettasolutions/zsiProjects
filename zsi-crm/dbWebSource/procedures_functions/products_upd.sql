

Create PROCEDURE [dbo].[products_upd]
(
    @tt    products_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	      product_code	    = b.product_code
			 ,product_name		= b.product_name	   
			 ,product_desc		= b.product_desc  
			 ,product_srp       = b.product_srp
			 ,product_dp		= b.product_dp	   
			 ,device_brand_id	= b.device_brand_id  
			 ,device_type_id    = b.device_type_id
			 ,updated_by        = @user_id
			 ,updated_date      = GETDATE()
       FROM dbo.products a INNER JOIN @tt b
	     ON a.product_id = b.product_id 
	    AND (isnull(is_edited,'N')='Y')

-- Insert Process
	INSERT INTO products (
         product_code
		,product_name		
		,product_desc	
		,product_srp    
		,product_dp	
		,device_brand_id
		,device_type_id 
		,created_by
		,created_date
		
    )
	SELECT 
		 product_code
		,product_name	
		,product_desc	
		,product_srp    
		,product_dp	
		,device_brand_id
		,device_type_id 
		,@user_id
	    ,GETDATE()
		
	FROM @tt 
	WHERE product_id IS NULL
      AND product_code IS NOT NULL; 
	   




