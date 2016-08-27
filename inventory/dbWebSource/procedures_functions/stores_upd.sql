CREATE PROCEDURE [dbo].[stores_upd]
(
    @tt    stores_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  store_name  = b.store_name
            ,updated_by   = @user_id
            ,updated_date = GETDATE()
     FROM dbo.stores a INNER JOIN @tt b
        ON a.store_id = b.store_id 
       WHERE (
				isnull(a.store_name,'') <> isnull(b.store_name,'')   
	   )

-- Insert Process

    INSERT INTO stores (
         store_name
        ,created_by
        ,created_date
        )
    SELECT 
        store_name
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE store_id IS NULL
END


  


