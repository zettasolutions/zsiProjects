

CREATE PROCEDURE [dbo].[receiving_details_sel]
(
    @receiving_id INT = null
   ,@user_id      INT 
   ,@col_no       INT = 1
   ,@order_no     INT = 0
   ,@master_ids varchar(max) = null


)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @stmt VARCHAR(MAX);
	DECLARE @role_id INT;
	DECLARE @organization_id INT;

	SET @stmt =  'SELECT * FROM dbo.receiving_details_v ' 
	           + ' WHERE receiving_id = ' + CAST(@receiving_id AS VARCHAR(20))
  
	SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
	IF @order_no = 0
		SET @stmt = @stmt + ' ASC';
	ELSE
		SET @stmt = @stmt + ' DESC';
  
	IF ltrim (rtrim( @master_ids)) <> ''
		SET @stmt='SELECT * FROM dbo.receiving_details_v WHERE receiving_id in (' + @master_ids + ')'

	EXEC(@stmt);
	
END
