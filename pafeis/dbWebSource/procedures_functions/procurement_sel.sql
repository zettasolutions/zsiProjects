

CREATE PROCEDURE [dbo].[procurement_sel]
(
    @procurement_id  INT = null
   ,@user_id		 INT 
   ,@col_no			 INT = 1
   ,@order_no		 INT = 0
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt VARCHAR(MAX)
DECLARE @role_id INT

  SELECT @role_id=role_id FROM users where user_id=@user_id;

  SET @stmt =  'SELECT * FROM dbo.procurement_v '
  
  IF @procurement_id IS NOT NULL  
	 SET @stmt = @stmt + ' WHERE procurement_id = ' + CAST(@procurement_id AS VARCHAR(20)); 
  ELSE
     SET @stmt = @stmt + 'WHERE role_id = '+ cast(@role_id as varchar(20)) 

  SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC';
  ELSE
     SET @stmt = @stmt + ' DESC';
   
  EXEC(@stmt);	
END

