
CREATE PROCEDURE [dbo].[procurement_detail_sel]
(
    @procurement_id INT = null
   ,@with_bal_qty  CHAR(1)='N'
   ,@master_ids varchar(max) = null
)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @stmt VARCHAR(MAX);
	
	SET @stmt =  'SELECT * FROM dbo.procurement_detail_v WHERE procurement_id = ' + CAST(@procurement_id AS VARCHAR(20)); 
	IF @with_bal_qty='Y'
	   SET @stmt = @stmt + ' AND balance_quantity > 0 '

	IF LTRIM(RTRIM(@master_ids)) <>  ''
		SET @stmt='SELECT * FROM dbo.procurement_detail_v WHERE procurement_id in (' + @master_ids + ')'
	
	EXEC(@stmt);
	
END



