
CREATE PROCEDURE [dbo].[brands_upd]
(
    @tt    brands_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  brand_name  = b.brand_name
            ,updated_by   = @user_id
            ,updated_date = GETDATE()
     FROM dbo.brands a INNER JOIN @tt b
        ON a.brand_id = b.brand_id 
       WHERE (
				isnull(a.brand_name,'') <> isnull(b.brand_name,'')   
	   )

-- Insert Process

    INSERT INTO brands (
         brand_name
        ,created_by
        ,created_date
        )
    SELECT 
        brand_name
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE brand_id IS NULL
END


  

