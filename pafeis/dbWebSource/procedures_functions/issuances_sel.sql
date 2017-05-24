
CREATE PROCEDURE [dbo].[issuances_sel]
(
    @issuance_id  INT = null
   ,@tab_name     varchar(50)=null
   ,@warehouse_id INT=NULL
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

  SET @stmt =  'SELECT DISTINCT * FROM dbo.issuances_v '
  
  IF @issuance_id IS NOT NULL  
	 SET @stmt = @stmt + ' WHERE issuance_id = ' + CAST(@issuance_id AS VARCHAR(20)); 
  ELSE
     SET @stmt = @stmt + 'WHERE role_id = '+ cast(@role_id as varchar(20)) 
	             + ' AND warehouse_id =' + cast(@warehouse_id as varchar(20))

--               + ' AND organization_id = ' + cast(@organization_id as varchar(20))

  IF ISNULL(@tab_name,'') <> ''
     SET @stmt = @stmt + ' AND issuance_type=''' + @tab_name + ''''

   SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no AS VARCHAR(20))

  
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC';
  ELSE
     SET @stmt = @stmt + ' DESC';
  
  --print @stmt 
  EXEC(@stmt);	
END


