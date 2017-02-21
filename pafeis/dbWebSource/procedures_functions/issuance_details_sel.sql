
CREATE PROCEDURE [dbo].[issuance_details_sel]
(
    @issuance_id INT = null
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
	
	SET @stmt =  'SELECT * FROM dbo.issuance_details_v WHERE issuance_id = ' + CAST(@issuance_id AS VARCHAR(20)); 

	SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
	IF @order_no = 0
		SET @stmt = @stmt + ' ASC';
	ELSE
		SET @stmt = @stmt + ' DESC';
  
	EXEC(@stmt);
	
END

