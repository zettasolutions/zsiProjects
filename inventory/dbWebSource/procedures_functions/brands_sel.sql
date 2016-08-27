
CREATE PROCEDURE [dbo].[brands_sel]
(
    @brand_id  INT = null
	,@user_id  int = null

)
AS
BEGIN
  DECLARE @stmt		VARCHAR(4000);
 
 SET @stmt = 'SELECT * FROM dbo.brands';
  IF @brand_id <> '' 
		SET @stmt = @stmt + ' WHERE brand_id='+ CAST(@brand_id AS VARCHAR(50));
   exec (@stmt);
END