

CREATE PROCEDURE [dbo].[procurement_sel]
(
    @procurement_id    INT = null
   ,@tab_name          NVARCHAR(30) = null  
   ,@user_id		   INT 
   ,@col_no			   INT = 1
   ,@order_no		   INT = 0
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt VARCHAR(MAX)
DECLARE @role_id INT
DECLARE @organization_id INT

  SELECT @organization_id=organization_id,@role_id=role_id FROM users where user_id=@user_id;

  SET @stmt =  'SELECT * FROM dbo.procurement_v WHERE organization_id= ' + cast(@organization_id as varchar(20))
  
  IF @procurement_id IS NOT NULL  
	 SET @stmt = @stmt + ' AND procurement_id = ' + CAST(@procurement_id AS VARCHAR(20)); 

  IF ISNULL(@tab_name,'')<>''
	 SET @stmt = @stmt + ' AND procurement_type = ''' + @tab_name + ''''

  SET @stmt = @stmt + ' AND role_id = '+ cast(@role_id as varchar(20)) 

  SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))
  
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC';
  ELSE
     SET @stmt = @stmt + ' DESC';
  --PRINT(@stmt);
  EXEC(@stmt);	
END

