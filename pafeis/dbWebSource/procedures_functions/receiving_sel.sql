
CREATE PROCEDURE [dbo].[receiving_sel] 
(
    @receiving_id INT = null
   ,@tab_name     varchar(50)=null
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
  

  SET @stmt =  'SELECT * FROM dbo.receiving_v '
  
  IF @receiving_id IS NOT NULL  
	 SET @stmt = @stmt + ' WHERE receiving_id = ' + CAST(@receiving_id AS VARCHAR(20)); 
  ELSE
     SET @stmt = @stmt + 'WHERE role_id = '+ cast(@role_id as varchar(20)) 
               + ' AND warehouse_id in (SELECT warehouse_id FROM dbo.user_warehouses(' + cast(@user_id as varchar(20)) + '))'

   IF ISNULL(@tab_name,'') <> ''
      SET @stmt = @stmt + ' AND receiving_type= ''' + @tab_name + ''''
  
   SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC';
  ELSE
     SET @stmt = @stmt + ' DESC';
  
  --print @stmt;
  exec(@stmt);
	
END







