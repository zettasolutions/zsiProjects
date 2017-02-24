
CREATE PROCEDURE [dbo].[flight_operation_sel]
(
    @flight_operation_id  INT = null
   ,@squadron_id  INT = NULL
   ,@user_id      INT = NULL
   ,@col_no       INT = 1
   ,@order_no     INT = 0

)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt VARCHAR(MAX)
DECLARE @role_id INT
DECLARE @organization_id INT

--  SELECT @role_id=role_id, @organization_id=organization_id FROM users where user_id=@user_id;

  SET @stmt =  'SELECT * FROM dbo.flight_operations_v '
  
  IF @flight_operation_id IS NOT NULL  
	 SET @stmt = @stmt + ' WHERE flight_operation_id = ' + CAST(@flight_operation_id AS VARCHAR(20)); 

  IF @squadron_id IS NOT NULL  
	 SET @stmt = @stmt + ' WHERE squadron_id = ' + CAST(@squadron_id AS VARCHAR(20)); 
/*
  ELSE
     SET @stmt = @stmt + 'WHERE role_id = '+ cast(@role_id as varchar(20)) 
               + ' AND squadron_id = ' + cast(@organization_id as varchar(20))
*/

  
   SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))

  
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC';
  ELSE
     SET @stmt = @stmt + ' DESC';
   
  EXEC(@stmt);	
END


