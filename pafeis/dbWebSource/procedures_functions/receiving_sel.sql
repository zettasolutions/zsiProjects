
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

  SELECT @role_id=role_id, @organization_id=organization_id FROM users where user_id=@user_id;
  

  SET @stmt =  'SELECT * FROM dbo.receiving_v '
  
  IF @receiving_id IS NOT NULL  
	 SET @stmt = @stmt + ' WHERE receiving_id = ' + CAST(@receiving_id AS VARCHAR(20)); 
  ELSE
     SET @stmt = @stmt + 'WHERE role_id = '+ cast(@role_id as varchar(20)) 
               + ' AND receiving_organization_id = ' + cast(@organization_id as varchar(20))

  IF @tab_name='SUPPLIER DELIVERY'
     SET @stmt = @stmt + ' AND ISNULL(dealer_id,0) <> 0'

  IF @tab_name='TRANSFER DELIVERY'
     SET @stmt = @stmt + ' AND ISNULL(transfer_organization_id,0) <> 0 '

  IF @tab_name='RETURN DELIVERY'
     SET @stmt = @stmt + ' AND ISNULL(aircraft_id,0) <> 0'

   SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC';
  ELSE
     SET @stmt = @stmt + ' DESC';
  
  exec(@stmt);
	
END






