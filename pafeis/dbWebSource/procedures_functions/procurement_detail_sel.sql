

CREATE PROCEDURE [dbo].[procurement_detail_sel]
(
    @procurement_id INT = null
   ,@user_id      INT 
   ,@col_no       INT = 1
   ,@order_no     INT = 0
)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @stmt VARCHAR(MAX);
	DECLARE @role_id INT;
	--DECLARE @organization_id INT;
	
	SET @stmt =  'SELECT * FROM dbo.procurement_detail WHERE procurement_id = ' + CAST(@procurement_id AS VARCHAR(20)); 

	SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
	IF @order_no = 0
		SET @stmt = @stmt + ' ASC';
	ELSE
		SET @stmt = @stmt + ' DESC';
  
	EXEC(@stmt);
	
END


