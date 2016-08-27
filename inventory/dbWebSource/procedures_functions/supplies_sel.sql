CREATE PROCEDURE [dbo].[supplies_sel]
(
    @store_id  INT = null
	,@user_id  int = null

)
AS
BEGIN
  DECLARE @stmt		VARCHAR(4000);
 
 SET @stmt = 'SELECT * FROM dbo.supplies';
  IF @store_id <> '' 
		SET @stmt = @stmt + ' WHERE store_id='+ CAST(@store_id AS VARCHAR(50));
   exec (@stmt);
END