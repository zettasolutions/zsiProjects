
CREATE PROCEDURE [dbo].[supply_brands_upd]
(
    @tt    supply_brands_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
 UPDATE a 
        SET 
			 supply_id			= b.supply_id 
			,store_id			= b.store_id
			,brand_id			= b.brand_id
			,conv_id			= b.conv_id
			,supply_cost		= b.supply_cost		
            ,updated_by			= @user_id
            ,updated_date		= GETDATE()
     FROM dbo.supply_brands a INNER JOIN @tt b
        ON a.supply_brand_id  = b.supply_brand_id  
       WHERE (
				isnull(a.supply_id,'')			     <> isnull(b.supply_id,'')  
			OR	isnull(a.store_id,'')				 <> isnull(b.store_id,'')   
			OR	isnull(a.brand_id,'')				 <> isnull(b.brand_id,'')   
			OR	isnull(a.conv_id,'')					 <> isnull(b.conv_id,'')   
			OR	isnull(a.supply_cost,0)				 <> isnull(b.supply_cost,0)
			
	   )
	 
-- Insert Process
    INSERT INTO supply_brands (
         supply_id		
		,store_id	
		,brand_id	
		,conv_id		
		,supply_cost			
		,created_by
        ,created_date
        )
    SELECT 
	    supply_id	
	   ,store_id
	   ,brand_id	
	   ,conv_id
	   ,supply_cost	
	   ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE supply_brand_id IS NULL
END



