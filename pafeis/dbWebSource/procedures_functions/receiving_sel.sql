
CREATE PROCEDURE [dbo].[receiving_sel] 
(
    @receiving_id INT = null
   ,@tab_name     varchar(50)=null
   ,@user_id      INT 
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
  

  SET @stmt =  'SELECT * FROM dbo.receiving_v '
  
  IF @receiving_id IS NOT NULL  
	 SET @stmt = @stmt + ' WHERE receiving_id = ' + CAST(@receiving_id AS VARCHAR(20)); 
  ELSE
     SET @stmt = @stmt + 'WHERE role_id = '+ cast(@role_id as varchar(20)) 
               + ' AND warehouse_id in (SELECT warehouse_id FROM dbo.user_warehouses(' + cast(@user_id as varchar(20)) + '))'

  IF @tab_name='SUPPLIER'
     SET @stmt = @stmt + ' AND receiving_type=''SUPPLIER'''

  IF @tab_name='DONATION'
     SET @stmt = @stmt + ' AND receiving_type=''DONATION'''

  IF @tab_name='TRANSFER'
     SET @stmt = @stmt + ' AND receiving_type=''TRANSFER'''

  IF @tab_name='AIRCRAFT'
     SET @stmt = @stmt + ' AND receiving_type=''AIRCRAFT'''

  IF @tab_name='OVERHAUL'
     SET @stmt = @stmt + ' AND report_type=''OVERHAUL'''

   SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC';
  ELSE
     SET @stmt = @stmt + ' DESC';
  
  --print @stmt;
  exec(@stmt);
	
END

SELECT * FROM receiving






