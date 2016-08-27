
CREATE PROCEDURE [dbo].[stores_sel]
(
    @store_id  INT = null
   ,@store_name  varchar(100) = null
   ,@user_id  int = null
)
AS
BEGIN
--  DECLARE @stmt		VARCHAR(4000);

  IF @store_id IS NOT NULL  
	 SELECT * FROM stores_v WHERE store_id = @store_id; 
  ELSE IF @store_name IS NOT NULL  
      SELECT * FROM stores_v WHERE store_name = @store_name 
	  ORDER BY store_name; 
  ELSE
      SELECT * FROM stores_v
	  ORDER BY store_name; 
	
END
 


