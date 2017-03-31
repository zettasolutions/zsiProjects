
create PROCEDURE [dbo].[physical_inv_details_sel]
(
    @physical_inv_id INT = null
   ,@user_id      INT 
   ,@col_no       INT = 1
   ,@order_no     INT = 0
)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @stmt VARCHAR(MAX);
	DECLARE @role_id INT;

	SET @stmt =  'SELECT * FROM dbo.physical_inv_details_v ' 
	           + ' WHERE physical_inv_id = ' + CAST(@physical_inv_id AS VARCHAR(20))
  
	SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
	IF @order_no = 0
		SET @stmt = @stmt + ' ASC';
	ELSE
		SET @stmt = @stmt + ' DESC';
  
	EXEC(@stmt);
	
END