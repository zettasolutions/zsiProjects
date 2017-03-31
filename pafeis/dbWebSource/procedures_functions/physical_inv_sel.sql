
CREATE PROCEDURE [dbo].[physical_inv_sel] 
(
    @physical_inv_id INT = null
   ,@user_id      INT = null
   ,@col_no       INT = 1
   ,@order_no     INT = 0
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt VARCHAR(MAX)
DECLARE @role_id INT
DECLARE @organization_id INT

  SELECT @role_id=role_id FROM users where user_id=@user_id;
  

  SET @stmt =  'SELECT * FROM dbo.physical_inv_v '
  
  IF @physical_inv_id IS NOT NULL  
	 SET @stmt = @stmt + ' WHERE physical_inv_id = ' + CAST(@physical_inv_id AS VARCHAR(20)); 
  ELSE
     SET @stmt = @stmt + 'WHERE role_id = '+ cast(@role_id as varchar(20)) 
               + ' AND warehouse_id in (SELECT warehouse_id FROM dbo.user_warehouses(' + cast(@user_id as varchar(20)) + '))'


   SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC';
  ELSE
     SET @stmt = @stmt + ' DESC';
  
  exec(@stmt);
	
END







