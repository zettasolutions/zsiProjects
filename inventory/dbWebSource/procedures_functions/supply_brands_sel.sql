
CREATE PROCEDURE [dbo].[supply_brands_sel]
(
    @store_id  INT = null
	,@user_id  int = null

)
AS
BEGIN
  DECLARE @stmt		VARCHAR(4000);
		SET @stmt = 'SELECT * FROM dbo.supply_brands';
  IF @store_id <> '' 
		SET @stmt = @stmt + ' WHERE store_id='+ CAST(@store_id AS VARCHAR(50));
   exec (@stmt);
END
 





